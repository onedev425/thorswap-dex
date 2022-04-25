import { useMemo } from 'react'

import {
  Amount,
  Asset,
  AssetAmount,
  Pool,
  Swap,
  DEFAULT_AFFILIATE_FEE,
} from '@thorswap-lib/multichain-sdk'

import { useApp } from 'store/app/hooks'

import { useNetworkFee } from 'hooks/useNetworkFee'

type Params = {
  poolLoading: boolean
  inputAsset: Asset
  inputAmount: Amount
  outputAsset: Asset
  pools: Pool[]
  isAffiliated: boolean
}

export const useSwap = ({
  poolLoading,
  inputAsset,
  inputAmount,
  outputAsset,
  pools,
  isAffiliated,
}: Params) => {
  const { slippageTolerance } = useApp()

  const { inboundFee, outboundFee } = useNetworkFee({
    inputAsset,
    outputAsset,
  })

  const swap: Swap | null = useMemo(() => {
    if (poolLoading || pools.length === 0) return null

    try {
      const inputAssetAmount = new AssetAmount(inputAsset, inputAmount)

      const inboundFeeInInputAsset = new AssetAmount(
        inputAsset,
        Amount.fromAssetAmount(
          inboundFee.totalPriceIn(inputAsset, pools).price,
          inputAsset.decimal,
        ),
      )

      const outboundFeeInOutputAsset = outboundFee
        ? new AssetAmount(
            outputAsset,
            Amount.fromAssetAmount(
              outboundFee.totalPriceIn(outputAsset, pools).price,
              outputAsset.decimal,
            ),
          )
        : new AssetAmount(
            outputAsset,
            Amount.fromAssetAmount(0, outputAsset.decimal),
          )

      if (isAffiliated) {
        return new Swap({
          inputAsset,
          outputAsset,
          pools,
          amount: inputAssetAmount,
          slip: slippageTolerance,
          fee: {
            inboundFee: inboundFeeInInputAsset,
            outboundFee: outboundFeeInOutputAsset,
          },
          affiliateFee: DEFAULT_AFFILIATE_FEE,
        })
      }

      return new Swap({
        inputAsset,
        outputAsset,
        pools,
        amount: inputAssetAmount,
        slip: slippageTolerance,
      })
    } catch (error) {
      console.error(error)
      return null
    }
  }, [
    inboundFee,
    inputAmount,
    inputAsset,
    outboundFee,
    outputAsset,
    poolLoading,
    pools,
    slippageTolerance,
    isAffiliated,
  ])

  return swap
}
