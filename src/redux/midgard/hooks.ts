import { useCallback, useMemo } from 'react'

import { batch } from 'react-redux'

import { ActionListParams, HistoryInterval } from '@thorswap-lib/midgard-sdk'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import * as actions from 'redux/midgard/actions'
import { useAppDispatch, useAppSelector } from 'redux/store'

import { TX_PUBLIC_PAGE_LIMIT } from 'settings/constants/global'

const MAX_HISTORY_COUNT = 100
const PER_DAY = 'day' as HistoryInterval

export const useMidgard = () => {
  const dispatch = useAppDispatch()
  const { midgardState, walletState } = useAppSelector(
    ({ midgard, wallet }) => ({ midgardState: midgard, walletState: wallet }),
  )
  const wallet = useMemo(() => walletState.wallet, [walletState])

  const isGlobalHistoryLoading = useMemo(
    () =>
      midgardState.earningsHistoryLoading ||
      midgardState.swapHistoryLoading ||
      midgardState.liquidityHistoryLoading,
    [midgardState],
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

  /**
   * reload pool member details for a specific chain
   * 1. fetch pool member data for chain wallet addr (asset asymm share, symm share)
   * 2. fetch pool member data for thorchain wallet addr (rune asymm share)
   */
  const loadMemberDetailsByChain = useCallback(
    (chain: SupportedChain) => {
      if (!wallet) return

      const assetChainAddress = wallet?.[chain]?.address
      const thorchainAddress = wallet?.[Chain.THORChain]?.address
      if (assetChainAddress && thorchainAddress) {
        dispatch(
          actions.reloadPoolMemberDetailByChain({
            chain,
            thorchainAddress,
            assetChainAddress,
          }),
        )
      }
    },
    [dispatch, wallet],
  )

  // get pool member details for a specific chain
  const getMemberDetailsByChain = useCallback(
    (chain: SupportedChain) => {
      if (!walletState.wallet) return

      const chainWalletAddr = walletState.wallet?.[chain]?.address

      if (chainWalletAddr) {
        dispatch(
          actions.getPoolMemberDetailByChain({
            chain,
            address: chainWalletAddr,
          }),
        )
      }
    },
    [dispatch, walletState.wallet],
  )

  // get pool member details for all chains
  const getAllMemberDetails = useCallback(() => {
    if (!walletState.wallet) return

    Object.keys(walletState.wallet).forEach((chain) => {
      getMemberDetailsByChain(chain as SupportedChain)
    })
  }, [getMemberDetailsByChain, walletState.wallet])

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
    ...midgardState,
    actions,
    isGlobalHistoryLoading,
    getAllMemberDetails,
    getPoolHistory,
    getGlobalHistory,
    getTxData,
    getInboundData,
    getNodes,
    loadMemberDetailsByChain,
  }
}
