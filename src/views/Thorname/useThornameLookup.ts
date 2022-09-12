import { THORNameDetails } from '@thorswap-lib/midgard-sdk';
import { Amount, Asset, THORName } from '@thorswap-lib/multichain-sdk';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import { showErrorToast } from 'components/Toast';
import usePrevious from 'hooks/usePrevious';
import { useCallback, useEffect, useReducer } from 'react';
import { t } from 'services/i18n';
import { getThornameDetails, registerThorname } from 'services/thorname';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { v4 } from 'uuid';

type Actions =
  | { type: 'setThorname'; payload: string }
  | { type: 'setAvailable' | 'setLoading'; payload: boolean }
  | {
      type: 'setDetails';
      payload: { details: THORNameDetails; available: boolean };
    }
  | { type: 'setChain'; payload: SupportedChain }
  | { type: 'setYears'; payload: number };

const initialState = {
  available: false,
  chain: Chain.THORChain as SupportedChain,
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

  const setChain = useCallback((chain: SupportedChain) => {
    dispatch({ type: 'setChain', payload: chain });
  }, []);

  const setThorname = useCallback((name: string) => {
    dispatch({ type: 'setThorname', payload: name });
  }, []);

  const setYears = useCallback((years: number) => {
    dispatch({ type: 'setYears', payload: years });
  }, []);

  const lookupForTNS = useCallback(
    async (providedThorname?: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true });
        const details = await getThornameDetails(providedThorname || thorname);

        dispatch({
          type: 'setDetails',
          payload: {
            details,
            available: owner ? details.owner === owner : false,
          },
        });

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
    [owner, thorname],
  );

  const registerThornameAddress = useCallback(
    async (address: string) => {
      if (!THORName.isValidName(thorname)) {
        return showErrorToast(t('notification.invalidTHORName'));
      }

      dispatch({ type: 'setLoading', payload: true });
      const amount =
        details?.owner !== owner ? THORName.getCost(years) : Amount.fromNormalAmount(years);

      const prefix =
        details?.owner !== owner ? t('txManager.registerThorname') : t('txManager.updateThorname');
      const id = v4();

      appDispatch(
        addTransaction({
          id,
          inChain: Chain.THORChain,
          type: TransactionType.TC_TNS,
          label: `${prefix} ${thorname} - ${amount.toSignificant(6)} ${Asset.RUNE().symbol}`,
        }),
      );

      try {
        const txid = await registerThorname({
          chain,
          amount,
          address,
          name: thorname,
        });

        if (txid) {
          appDispatch(updateTransaction({ id, txid }));
        }
      } catch (_error: NotWorth) {
        appDispatch(completeTransaction({ id, status: 'error' }));
        showErrorToast(t('notification.submitFail'));
      } finally {
        dispatch({ type: 'setLoading', payload: false });
      }
    },
    [thorname, details?.owner, owner, years, appDispatch, chain],
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
