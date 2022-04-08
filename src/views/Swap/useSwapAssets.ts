import { useMemo } from 'react'

import {
  Asset,
  getInputAssets,
  hasConnectedWallet,
} from '@thorswap-lib/multichain-sdk'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import { IS_SYNTH_ACTIVE } from 'settings/config'

export const useSwapAssets = () => {
  const { pools: allPools } = useMidgard()
  const { wallet } = useWallet()

  const pools = useMemo(
    () => allPools.filter((data) => data.detail.status === 'available'),
    [allPools],
  )

  const poolAssets = useMemo(
    () => [...pools.map(({ asset }) => asset), Asset.RUNE()],
    [pools],
  )

  const synthAssets = useMemo(
    () =>
      pools.map(
        ({ asset: { chain, symbol } }) => new Asset(chain, symbol, true),
      ),
    [pools],
  )

  const outputAssets = useMemo(
    () => (IS_SYNTH_ACTIVE ? [...poolAssets, ...synthAssets] : poolAssets),
    [poolAssets, synthAssets],
  )

  const inputAssets = useMemo(
    () =>
      hasConnectedWallet(wallet)
        ? getInputAssets({ wallet, pools })
        : outputAssets,
    [wallet, pools, outputAssets],
  )

  return {
    pools,
    outputAssets,
    inputAssets,
  }
}
