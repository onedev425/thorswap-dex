import { useEffect, useCallback, useMemo } from 'react'

import { useSelector, useDispatch } from 'react-redux'

import { getWalletAddressByChain } from '@thorswap-lib/multichain-sdk'
import { THORChain } from '@thorswap-lib/xchain-util'

import { getLiquidityProviderData } from 'store/midgard/actions'
import { RootState } from 'store/store'

export const usePendingLP = () => {
  const dispatch = useDispatch()

  const { wallet } = useSelector((state: RootState) => state.wallet)
  const { pools, pendingLP, pendingLPLoading } = useSelector(
    (state: RootState) => state.midgard,
  )

  const getPendingDeposit = useCallback(() => {
    if (wallet) {
      // const activePools = pools.filter(
      //   (pool) => pool.detail.status === 'available',
      // )
      const thorAddress = getWalletAddressByChain(wallet, THORChain)

      if (thorAddress) {
        pools.forEach((pool) => {
          dispatch(
            getLiquidityProviderData({
              address: thorAddress,
              asset: pool.asset.toString(),
            }),
          )
        })
      }
    }
  }, [dispatch, wallet, pools])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => getPendingDeposit(), [])

  const hasPendingDeposit = useMemo(
    () => Object.keys(pendingLP).length > 0,
    [pendingLP],
  )

  return {
    getPendingDeposit,
    pools,
    pendingLP,
    pendingLPLoading,
    hasPendingDeposit,
  }
}
