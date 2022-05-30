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
import {
  getAddressThornames,
  getThornameDetails,
  registerThorname,
} from 'services/thorname'

type Actions =
  | { type: 'setThorname'; payload: string }
  | { type: 'setAvailable' | 'setLoading'; payload: boolean }
  | {
      type: 'setDetails'
      payload: { details: THORNameDetails; available: boolean }
    }
  | { type: 'setChain'; payload: SupportedChain }
  | { type: 'setYears'; payload: number }
  | {
      type: 'setRegisteredThornames'
      payload: (THORNameDetails & { thorname: string })[] | null
    }

const initialState = {
  available: false,
  chain: THORChain as SupportedChain,
  details: null as THORNameDetails | null,
  loading: false,
  registeredThornames: null as
    | (THORNameDetails & { thorname: string })[]
    | null,
  thorname: '',
  years: 1,
}

const reducer = (state: typeof initialState, { type, payload }: Actions) => {
  switch (type) {
    case 'setThorname':
      return {
        ...(payload.length === 0 ? initialState : state),
        thorname: payload,
      }
    case 'setDetails':
      return {
        ...state,
        details: payload.details,
        available: payload.available,
        loading: false,
      }
    case 'setLoading':
      return { ...state, loading: payload }
    case 'setAvailable':
      return { ...state, loading: false, available: payload }
    case 'setYears':
      return { ...state, years: Math.min(Math.max(1, payload), 99) }
    case 'setChain':
      return { ...state, chain: payload }
    case 'setRegisteredThornames':
      return { ...state, registeredThornames: payload }

    default:
      return state
  }
}

export const useThornameLookup = (owner?: string) => {
  const { submitTransaction, pollTransaction } = useTxTracker()
  const prevOwner = usePrevious(owner)
  const [
    {
      available,
      chain,
      details,
      loading,
      registeredThornames,
      thorname,
      years,
    },
    dispatch,
  ] = useReducer(reducer, initialState)

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

  const getRegisteredThornames = useCallback(async () => {
    if (!owner) return

    const thornames = await getAddressThornames(owner)
    const thornamesDetails = await Promise.all(
      thornames.map(async (name) => ({
        ...(await getThornameDetails(name)),
        thorname: name,
      })),
    )

    dispatch({ type: 'setRegisteredThornames', payload: thornamesDetails })
  }, [owner])

  const lookupForTNS = useCallback(async () => {
    try {
      dispatch({ type: 'setLoading', payload: true })
      const details = await getThornameDetails(thorname)

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
  }, [owner, setDetails, thorname])

  const registerThornameAddress = useCallback(
    async (address: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true })
        const amount =
          details?.owner !== owner
            ? THORName.getCost(years)
            : Amount.fromNormalAmount(0)

        const submitTx = {
          inAssets: [
            { asset: Asset.RUNE().symbol, amount: amount.toSignificant(3) },
          ],
        }

        const trackId = submitTransaction({
          type: TxTrackerType.RegisterThorname,
          submitTx,
        })

        await registerThorname({ chain, amount, address, name: thorname })
        pollTransaction({
          type: TxTrackerType.RegisterThorname,
          uuid: trackId,
          submitTx,
        })
        dispatch({ type: 'setThorname', payload: '' })
      } catch (error: ToDo) {
        showErrorToast(t('common.defaultErrMsg'))
      } finally {
        dispatch({ type: 'setLoading', payload: false })
      }
    },
    [
      details?.owner,
      owner,
      years,
      submitTransaction,
      chain,
      thorname,
      pollTransaction,
    ],
  )

  useEffect(() => {
    if (owner && !registeredThornames) {
      getRegisteredThornames()
    } else if (!owner && registeredThornames) {
      dispatch({ type: 'setRegisteredThornames', payload: null })
    }
  }, [getRegisteredThornames, owner, registeredThornames])

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
    registeredThornames,
    thorname,
    years,

    lookupForTNS,
    registerThornameAddress,
    setChain,
    setThorname,
    setYears,
  }
}
