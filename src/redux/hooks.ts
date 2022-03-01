import { useCallback } from 'react'

import { Amount, Asset, Price, runeToAsset } from '@thorswap-lib/multichain-sdk'

import { useMidgard } from 'redux/midgard/hooks'
import { useAppDispatch } from 'redux/store'

import { useApp } from './app/hooks'

/**
 * hooks for managing global state per page, loading etc
 */
export const useGlobalState = () => {
  const dispatch = useAppDispatch()

  const { baseCurrency } = useApp()
  const { actions, pools } = useMidgard()

  const loadInitialData = useCallback(() => {
    dispatch(actions.getVolume24h())
    dispatch(actions.getPools())
    dispatch(actions.getStats())
    dispatch(actions.getNetworkData())
    dispatch(actions.getLastblock())
    dispatch(actions.getMimir())
    dispatch(actions.getQueue())
  }, [dispatch, actions])

  const refreshPage = useCallback(
    (route = undefined) => {
      console.log('route: ', route?.pathname)
      if (!route) {
        loadInitialData()
      } else {
        dispatch(actions.getPools())
        dispatch(actions.getMimir())
        dispatch(actions.getStats())
      }
    },
    [loadInitialData, dispatch, actions],
  )

  const runeToCurrency = useCallback(
    (runeAmount: Amount): Price => {
      const quoteAsset = Asset.fromAssetString(baseCurrency)

      return runeToAsset({
        runeAmount,
        quoteAsset,
        pools,
      })
    },
    [baseCurrency, pools],
  )

  return {
    loadInitialData,
    refreshPage,
    runeToCurrency,
  }
}
