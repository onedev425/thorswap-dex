import { useEffect, useCallback, useMemo } from 'react'

import { Chain } from '@thorswap-lib/types'

import { getLiquidityProviderData } from 'store/midgard/actions'
import { useAppDispatch, useAppSelector } from 'store/store'

import { multichain } from 'services/multichain'

export const usePendingLP = () => {
  const dispatch = useAppDispatch()

  const { pools, pendingLP, pendingLPLoading, wallet } = useAppSelector(
    ({
      midgard: { pools, pendingLP, pendingLPLoading },
      wallet: { wallet },
    }) => ({
      wallet,
      pendingLP,
      pools,
      pendingLPLoading,
    }),
  )

  const getPendingDeposit = useCallback(() => {
    if (wallet) {
      const thorAddress = multichain().getWalletAddressByChain(Chain.THORChain)

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
