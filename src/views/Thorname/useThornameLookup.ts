import { Amount, getTHORNameCost, validateTHORName } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { RUNEAsset } from 'helpers/assets';
import { shortenAddress } from 'helpers/shortenAddress';
import usePrevious from 'hooks/usePrevious';
import { useCallback, useEffect, useReducer } from 'react';
import { t } from 'services/i18n';
import { useLazyGetTNSDetailQuery } from 'store/midgard/api';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import type { THORNameDetails } from 'types/app';
import { v4 } from 'uuid';

type Actions =
  | { type: 'setThorname'; payload: string }
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
  thorname: '',
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

    case 'setThorname': {
      const hasPayload = payload.length >= 1;

      return {
        ...(hasPayload ? state : initialState),
        thorname: hasPayload
          ? validateTHORName(payload)
            ? payload.toLowerCase()
            : state.thorname
          : '',
      };
    }

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
  const [{ available, chain, details, loading, thorname, years }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const [getTNSDetail] = useLazyGetTNSDetailQuery();

  const setChain = useCallback((chain: Chain) => {
    dispatch({ type: 'setChain', payload: chain });
  }, []);

  const setThorname = useCallback((name: string) => {
    dispatch({ type: 'setThorname', payload: name });
  }, []);

  const setYears = useCallback((years: number) => {
    dispatch({ type: 'setYears', payload: years });
  }, []);

  const loadDetails = useCallback(
    async (providedThorname?: string) => {
      const { data: details } = await getTNSDetail(providedThorname || thorname);
      const payload =
        !details || typeof details === 'boolean'
          ? { details: null, available: true }
          : { details, available: owner ? details.owner === owner : false };
      dispatch({
        type: 'setDetails',
        payload,
      });
    },
    [getTNSDetail, owner, thorname],
  );

  const lookupForTNS = useCallback(
    async (providedThorname?: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true });
        loadDetails(providedThorname);

        return true;
      } catch (error: NotWorth) {
        console.error(error);
        const notFound = error?.response?.status === 404;
        dispatch({ type: 'setAvailable', payload: notFound });

        if (!notFound) {
          showErrorToast(t('common.defaultErrMsg'));
        }

        return false;
      }
    },
    [loadDetails],
  );

  const registerThornameAddress = useCallback(
    async (address: string, newOwner?: string) => {
      if (!validateTHORName(thorname)) {
        return showErrorToast(t('notification.invalidTHORName'));
      }

      const isTransfer = !!newOwner;
      const isRegister = details?.owner !== owner;

      dispatch({ type: 'setLoading', payload: true });
      const amount = isRegister ? getTHORNameCost(years) : years;
      const prefix = isRegister ? t('txManager.registerThorname') : t('txManager.updateThorname');

      let label = `${prefix} ${thorname} - ${amount} ${RUNEAsset.name}`;
      if (details?.owner && isTransfer) {
        label = `${t('common.transfer')} ${thorname} - ${shortenAddress(newOwner, 6, 8)}`;
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
        ? { address: newOwner, owner: newOwner || owner, name: thorname, chain: Chain.THORChain }
        : { address, owner: owner, name: thorname, chain };

      const { registerThorname } = await (await import('services/swapKit')).getSwapKitClient();

      try {
        const txid = await registerThorname(
          registerParams,
          Amount.fromAssetAmount(amount, RUNEAsset.decimal),
        );

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'));
      } finally {
        dispatch({ type: 'setLoading', payload: false });
        setTimeout(loadDetails, 5000);
      }
    },
    [thorname, details?.owner, owner, years, appDispatch, chain, loadDetails],
  );

  useEffect(() => {
    if (thorname && owner !== prevOwner) {
      lookupForTNS();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);

  return {
    available,
    chain,
    details,
    loading,
    thorname,
    years,

    lookupForTNS,
    registerThornameAddress,
    setChain,
    setThorname,
    setYears,
  };
};
