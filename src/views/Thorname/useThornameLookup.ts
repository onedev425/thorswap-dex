import { useCallback, useReducer } from 'react'

import { THORNameDetails } from '@thorswap-lib/midgard-sdk'
import { THORName, SupportedChain } from '@thorswap-lib/multichain-sdk'
import { THORChain } from '@thorswap-lib/xchain-util'

import { showToast, ToastType } from 'components/Toast'

import { t } from 'services/i18n'
import { getThornameDetails, registerThorname } from 'services/thorname'

type Actions =
  | { type: 'setThorname'; payload: string }
  | { type: 'setAvailable' | 'setLoading'; payload: boolean }
  | { type: 'setDetails'; payload: THORNameDetails }
  | { type: 'setChain'; payload: SupportedChain }
  | { type: 'setYears'; payload: number }

const initialState = {
  chain: THORChain as SupportedChain,
  years: 1,
  thorname: '',
  details: null as THORNameDetails | null,
  loading: false,
  available: false,
}

const reducer = (state: typeof initialState, { type, payload }: Actions) => {
  switch (type) {
    case 'setThorname': {
      const restOfState = payload.length === 0 ? initialState : state
      return {
        ...restOfState,
        thorname: payload,
      }
    }
    case 'setDetails':
      return { ...state, details: payload, loading: false }
    case 'setLoading':
      return { ...state, loading: payload }
    case 'setAvailable':
      return { ...state, loading: false, available: payload }
    case 'setYears':
      return { ...state, years: Math.min(Math.max(1, payload), 99) }
    case 'setChain':
      return { ...state, chain: payload }

    default:
      return state
  }
}

export const useThornameLookup = () => {
  const [{ chain, years, thorname, details, loading, available }, dispatch] =
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

  const setDetails = useCallback((details: THORNameDetails) => {
    dispatch({ type: 'setDetails', payload: details })
  }, [])

  const lookupForTNS = useCallback(async () => {
    try {
      dispatch({ type: 'setLoading', payload: true })
      const thornameDetails = await getThornameDetails(thorname)

      setDetails(thornameDetails)
    } catch (error: ToDo) {
      const notFound = error?.response?.status === 404
      dispatch({ type: 'setAvailable', payload: notFound })

      if (!notFound) {
        showToast({ message: t('common.defaultErrMsg') }, ToastType.Error)
      }
    }
  }, [setDetails, thorname])

  const registerThornameAddress = useCallback(
    async (address: string) => {
      try {
        dispatch({ type: 'setLoading', payload: true })
        await registerThorname({
          chain,
          amount: THORName.getCost(years),
          address,
          name: thorname,
          // TODO:
          // owner: '',
        })
        showToast(
          { message: t('views.thorname.registerSuccess', { thorname }) },
          ToastType.Success,
        )
      } catch (error: ToDo) {
        showToast({ message: t('common.defaultErrMsg') }, ToastType.Error)
      } finally {
        dispatch({ type: 'setLoading', payload: false })
      }
    },
    [chain, years, thorname],
  )

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
