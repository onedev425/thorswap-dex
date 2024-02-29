import { AssetValue, Chain, getTHORNameCost, validateTHORName } from '@swapkit/core';
import { showErrorToast } from 'components/Toast';
import { RUNEAsset } from 'helpers/assets';
import { shortenAddress } from 'helpers/shortenAddress';
import usePrevious from 'hooks/usePrevious';
import { useCallback, useEffect, useReducer } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { useLazyGetTNSDetailQuery } from 'store/midgard/api';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import type { THORNameDetails } from 'types/app';
import { v4 } from 'uuid';

type Actions =
  | { type: 'setSearchedThorname'; payload: string }
  | { type: 'setCurrentThorname'; payload: string }
  | { type: 'setAvailable' | 'setLoading'; payload: boolean }
  | {
      type: 'setDetails';
      payload: { details: Maybe<THORNameDetails>; available: boolean };
    }
  | { type: 'setChain'; payload: Chain }
  | { type: 'setYears'; payload: number };

const initialState = {
  available: false,
  chain: Chain.THORChain as Chain,
  details: null as Maybe<THORNameDetails>,
  loading: false,
  searchedThorname: '',
  currentThorname: '',
  years: 1,
};

const reducer = (state: typeof initialState, { type, payload }: Actions) => {
  switch (type) {
    case 'setLoading':
      return { ...state, loading: payload };
    case 'setChain':
      return { ...state, chain: payload };
    case 'setAvailable':
      return { ...state, loading: false, available: payload };

    case 'setSearchedThorname': {
      const hasPayload = payload.length >= 1;

      return {
        ...(hasPayload ? state : initialState),
        searchedThorname: hasPayload
          ? validateTHORName(payload)
            ? payload.toLowerCase()
            : state.searchedThorname
          : '',
      };
    }
    case 'setCurrentThorname':
      return { ...state, currentThorname: payload };

    case 'setDetails':
      return {
        ...state,
        details: payload.details,
        available: payload.available,
        loading: false,
        years: payload.details ? 0 : 1,
      };

    case 'setYears':
      return {
        ...state,
        years: Math.min(Math.max(state.details ? 0 : 1, payload), 99),
      };

    default:
      return state;
  }
};

export const useThornameLookup = (owner?: string) => {
  const appDispatch = useAppDispatch();
  const prevOwner = usePrevious(owner);
  const [
    { available, chain, details, loading, searchedThorname, currentThorname, years },
    dispatch,
  ] = useReducer(reducer, initialState);

  const [getTNSDetail] = useLazyGetTNSDetailQuery();

  const setChain = useCallback((chain: Chain) => {
    dispatch({ type: 'setChain', payload: chain });
  }, []);

  const setSearchedThorname = useCallback((name: string) => {
    dispatch({ type: 'setSearchedThorname', payload: name });
  }, []);

  const setCurrentThorname = useCallback((payload: string) => {
    dispatch({ type: 'setCurrentThorname', payload });
  }, []);

  const setYears = useCallback((years: number) => {
    dispatch({ type: 'setYears', payload: years });
  }, []);

  const loadDetails = useCallback(
    async (providedThorname?: string) => {
      const { data: details } = await getTNSDetail(providedThorname || searchedThorname);

      const payload =
        Array.isArray(details) || !details || typeof details === 'boolean'
          ? { details: null, available: true }
          : { details, available: owner ? details.owner === owner : false };
      dispatch({
        type: 'setDetails',
        payload,
      });
    },
    [getTNSDetail, owner, searchedThorname],
  );

  const lookupForTNS = useCallback(
    async (providedThorname?: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true });
        loadDetails(providedThorname);

        return true;
      } catch (error: NotWorth) {
        logException(error.toString());
        const notFound = error?.response?.status === 404;
        dispatch({ type: 'setAvailable', payload: notFound });

        if (!notFound) {
          showErrorToast(t('common.defaultErrMsg'), undefined, undefined, error as Error);
        }

        return false;
      }
    },
    [loadDetails],
  );

  const registerThornameAddress = useCallback(
    async (address: string, newOwner?: string) => {
      if (!validateTHORName(searchedThorname)) {
        return showErrorToast(t('notification.invalidTHORName'));
      }

      const isTransfer = !!newOwner;
      const isRegister = details?.owner !== owner;

      dispatch({ type: 'setLoading', payload: true });
      const amount = isRegister ? getTHORNameCost(years) : years;
      const prefix = isRegister ? t('txManager.registerThorname') : t('txManager.updateThorname');

      let label = `${prefix} ${searchedThorname} - ${amount} ${RUNEAsset.ticker}`;
      if (details?.owner && isTransfer) {
        label = `${t('common.transfer')} ${searchedThorname} - ${shortenAddress(newOwner, 6, 8)}`;
      }
      const id = v4();

      appDispatch(
        addTransaction({
          id,
          inChain: Chain.THORChain,
          type: isTransfer ? TransactionType.TC_TNS_UPDATE : TransactionType.TC_TNS_CREATE,
          label,
        }),
      );

      const registerParams = isTransfer
        ? {
            address: newOwner,
            owner: newOwner || owner,
            name: searchedThorname,
            chain: Chain.THORChain,
          }
        : { address, owner: owner, name: searchedThorname, chain };

      const { thorchain } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        if (!thorchain) {
          throw new Error('THORChain Provider not found');
        }
        const txid = await thorchain.registerThorname({
          assetValue: AssetValue.fromChainOrSignature(Chain.THORChain, amount),
          ...registerParams,
        });

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'), undefined, undefined, error as Error);
      } finally {
        dispatch({ type: 'setLoading', payload: false });
        setTimeout(loadDetails, 5000);
      }
    },
    [searchedThorname, details?.owner, owner, years, appDispatch, chain, loadDetails],
  );

  useEffect(() => {
    if (searchedThorname && owner !== prevOwner) {
      lookupForTNS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);

  return {
    available,
    chain,
    details,
    loading,
    searchedThorname,
    currentThorname,
    years,

    lookupForTNS,
    registerThornameAddress,
    setChain,
    setSearchedThorname,
    setCurrentThorname,
    setYears,
  };
};
