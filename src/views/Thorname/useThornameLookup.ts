import { useCallback, useEffect, useReducer } from 'react'

import { THORNameDetails } from '@thorswap-lib/midgard-sdk'
import {
  THORName,
  SupportedChain,
  Asset,
  Amount,
} from '@thorswap-lib/multichain-sdk'
import { THORChain } from '@thorswap-lib/xchain-util'

import { showErrorToast } from 'components/Toast'

import { TxTrackerType } from 'store/midgard/types'

import usePrevious from 'hooks/usePrevious'
import { useTxTracker } from 'hooks/useTxTracker'

import { t } from 'services/i18n'
import { getThornameDetails, registerThorname } from 'services/thorname'

type Actions =
  | { type: 'setThorname'; payload: string }
  | { type: 'setAvailable' | 'setLoading'; payload: boolean }
  | {
      type: 'setDetails'
      payload: { details: THORNameDetails; available: boolean }
    }
  | { type: 'setChain'; payload: SupportedChain }
  | { type: 'setYears'; payload: number }

const initialState = {
  available: false,
  chain: THORChain as SupportedChain,
  details: null as THORNameDetails | null,
  loading: false,
  thorname: '',
  years: 1,
}

const reducer = (state: typeof initialState, { type, payload }: Actions) => {
  switch (type) {
    case 'setLoading':
      return { ...state, loading: payload }
    case 'setChain':
      return { ...state, chain: payload }
    case 'setAvailable':
      return { ...state, loading: false, available: payload }

    case 'setThorname': {
      const hasPayload = payload.length >= 1

      return {
        ...(hasPayload ? state : initialState),
        thorname: hasPayload
          ? THORName.isValidName(payload)
            ? payload
            : state.thorname
          : '',
      }
    }

    case 'setDetails':
      return {
        ...state,
        details: payload.details,
        available: payload.available,
        loading: false,
        years: 0,
      }

    case 'setYears':
      return {
        ...state,
        years: Math.min(Math.max(state.details ? 0 : 1, payload), 99),
      }

    default:
      return state
  }
}

export const useThornameLookup = (owner?: string) => {
  const { submitTransaction, setTxFailed, pollTransaction } = useTxTracker()
  const prevOwner = usePrevious(owner)
  const [{ available, chain, details, loading, thorname, years }, dispatch] =
    useReducer(reducer, initialState)

  const setChain = useCallback((chain: SupportedChain) => {
    dispatch({ type: 'setChain', payload: chain })
  }, [])

  const setThorname = useCallback((name: string) => {
    dispatch({ type: 'setThorname', payload: name })
  }, [])

  const setYears = useCallback((years: number) => {
    dispatch({ type: 'setYears', payload: years })
  }, [])

  const setDetails = useCallback(
    ({
      details,
      available,
    }: {
      details: THORNameDetails
      available: boolean
    }) => {
      dispatch({ type: 'setDetails', payload: { details, available } })
    },
    [],
  )

  const lookupForTNS = useCallback(
    async (providedThorname?: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true })
        const details = await getThornameDetails(providedThorname || thorname)

        setDetails({
          details,
          available: owner ? details.owner === owner : false,
        })
      } catch (error: ToDo) {
        const notFound = error?.response?.status === 404
        dispatch({ type: 'setAvailable', payload: notFound })

        if (!notFound) {
          showErrorToast(t('common.defaultErrMsg'))
        }
      }
    },
    [owner, setDetails, thorname],
  )

  const registerThornameAddress = useCallback(
    async (address: string) => {
      if (!THORName.isValidName(thorname)) {
        return showErrorToast(t('notification.invalidTHORName'))
      }

      const amount =
        details?.owner !== owner
          ? THORName.getCost(years)
          : Amount.fromNormalAmount(years)

      const submitTx = {
        inAssets: [
          { asset: Asset.RUNE().symbol, amount: amount.toSignificant(6) },
        ],
      }

      const type =
        details?.owner !== owner
          ? TxTrackerType.RegisterThorname
          : TxTrackerType.UpdateThorname

      const uuid = submitTransaction({ type, submitTx })

      try {
        dispatch({ type: 'setLoading', payload: true })

        const txID = await registerThorname({
          chain,
          amount,
          address,
          name: thorname,
        })
        pollTransaction({ type, uuid, submitTx: { ...submitTx, txID } })

        dispatch({ type: 'setThorname', payload: '' })
      } catch (error: ToDo) {
        setTxFailed(uuid)

        showErrorToast(t('notification.submitFail'))
      } finally {
        dispatch({ type: 'setLoading', payload: false })
      }
    },
    [
      thorname,
      details?.owner,
      owner,
      years,
      submitTransaction,
      chain,
      pollTransaction,
      setTxFailed,
    ],
  )

  useEffect(() => {
    if (thorname && owner !== prevOwner) {
      lookupForTNS()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner])

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
  }
}
