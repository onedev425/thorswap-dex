import { THORNameDetails } from '@thorswap-lib/midgard-sdk';
import { Amount, Asset, THORName } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import { shortenAddress } from 'helpers/shortenAddress';
import usePrevious from 'hooks/usePrevious';
import { useCallback, useEffect, useReducer } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { getThornameDetails } from 'services/thorname';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

type Actions =
  | { type: 'setThorname'; payload: string }
  | { type: 'setAvailable' | 'setLoading'; payload: boolean }
  | {
      type: 'setDetails';
      payload: { details: THORNameDetails | null; available: boolean };
    }
  | { type: 'setChain'; payload: Chain }
  | { type: 'setYears'; payload: number };

const initialState = {
  available: false,
  chain: Chain.THORChain as Chain,
  details: null as THORNameDetails | null,
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
          ? THORName.isValidName(payload)
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
        years: 0,
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
      const details = await getThornameDetails(providedThorname || thorname);
      const payload =
        typeof details === 'boolean'
          ? { details: null, available: true }
          : { details, available: owner ? details.owner === owner : false };
      dispatch({
        type: 'setDetails',
        payload,
      });
    },
    [owner, thorname],
  );

  const lookupForTNS = useCallback(
    async (providedThorname?: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true });
        loadDetails(providedThorname);

        return true;
      } catch (error: ToDo) {
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
      if (!THORName.isValidName(thorname)) {
        return showErrorToast(t('notification.invalidTHORName'));
      }

      const isTransfer = !!newOwner;

      dispatch({ type: 'setLoading', payload: true });
      const amount =
        details?.owner !== owner ? THORName.getCost(years) : Amount.fromNormalAmount(years);

      const prefix =
        details?.owner !== owner ? t('txManager.registerThorname') : t('txManager.updateThorname');

      let label = `${prefix} ${thorname} - ${amount.toSignificantWithMaxDecimals(6)} ${
        Asset.RUNE().name
      }`;
      if (details?.owner && isTransfer) {
        label = `${t('common.transfer')} ${thorname} - ${shortenAddress(newOwner, 6, 8)}`;
      }
      const id = v4();

      appDispatch(
        addTransaction({
          id,
          inChain: Chain.THORChain,
          type: TransactionType.TC_TNS,
          label,
        }),
      );

      const registerParams = isTransfer
        ? { address: newOwner, owner: newOwner || owner, name: thorname, chain: Chain.THORChain }
        : { address, owner: owner, name: thorname, chain };

      try {
        const txid = await multichain().registerThorname(registerParams, amount);

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (_error: NotWorth) {
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'));
      } finally {
        dispatch({ type: 'setLoading', payload: false });
        // TODO - remove this hack once tx tracker will be fixed
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
