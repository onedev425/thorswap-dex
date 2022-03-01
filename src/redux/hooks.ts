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
    dispatch(actions.getPools())
  }, [dispatch, actions])

  const refreshPage = useCallback(() => {
    dispatch(actions.getPools())
  }, [dispatch, actions])

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
