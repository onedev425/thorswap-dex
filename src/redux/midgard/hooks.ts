import { useCallback, useMemo } from 'react'

import { batch } from 'react-redux'

import { ActionListParams, HistoryInterval } from '@thorswap-lib/midgard-sdk'

import * as actions from 'redux/midgard/actions'
import { useAppDispatch, useAppSelector } from 'redux/store'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants/global'

const MAX_HISTORY_COUNT = 100
const PER_DAY = 'day' as HistoryInterval

export const useMidgard = () => {
  const dispatch = useAppDispatch()
  const {
    pools,
    earningsHistoryLoading,
    liquidityHistoryLoading,
    swapHistoryLoading,
  } = useAppSelector(({ midgard }) => midgard)

  const isGlobalHistoryLoading = useMemo(
    () =>
      earningsHistoryLoading || swapHistoryLoading || liquidityHistoryLoading,
    [earningsHistoryLoading, liquidityHistoryLoading, swapHistoryLoading],
  )

  // get earnings, swap, liquidity history
  const getGlobalHistory = useCallback(() => {
    // fetch historical data till past day
    const query = { interval: PER_DAY, count: MAX_HISTORY_COUNT }

    batch(() => {
      dispatch(actions.getEarningsHistory(query))
      dispatch(actions.getTVLHistory(query))
      dispatch(actions.getSwapHistory({ query }))
      dispatch(actions.getLiquidityHistory({ query }))
    })
  }, [dispatch])

  const getPoolHistory = useCallback(
    (pool: string) => {
      // fetch historical data till past day
      const query = {
        pool,
        query: { interval: PER_DAY, count: MAX_HISTORY_COUNT },
      }

      batch(() => {
        dispatch(actions.getSwapHistory(query))
        dispatch(actions.getDepthHistory(query))
        dispatch(actions.getLiquidityHistory(query))
      })
    },
    [dispatch],
  )

  // get tx data
  const getTxData = useCallback(
    ({ limit = TX_PUBLIC_PAGE_LIMIT, ...otherParams }: ActionListParams) => {
      dispatch(actions.getActions({ ...otherParams, limit }))
    },
    [dispatch],
  )

  const getInboundData = useCallback(() => {
    dispatch(actions.getThorchainInboundData())
  }, [dispatch])

  const getNodes = useCallback(() => {
    dispatch(actions.getNodes())
  }, [dispatch])

  return {
    actions,
    pools,
    isGlobalHistoryLoading,
    getPoolHistory,
    getGlobalHistory,
    getTxData,
    getInboundData,
    getNodes,
  }
}
