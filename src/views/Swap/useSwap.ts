import { useMemo } from 'react'

import {
  Amount,
  Asset,
  AssetAmount,
  Pool,
  Swap,
} from '@thorswap-lib/multichain-sdk'

import { useApp } from 'store/app/hooks'

import { useNetworkFee } from 'hooks/useNetworkFee'

type Params = {
  poolLoading: boolean
  inputAsset: Asset
  inputAmount: Amount
  outputAsset: Asset
  pools: Pool[]
}

export const useSwap = ({
  poolLoading,
  inputAsset,
  inputAmount,
  outputAsset,
  pools,
}: Params) => {
  const { slippageTolerance } = useApp()

  const { inboundFee, outboundFee } = useNetworkFee({
    inputAsset,
    outputAsset,
  })

  const swap: Swap | null = useMemo(() => {
    if (poolLoading) return null

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
      console.log(
        'outboundFeeInOutputAsset',
        outboundFeeInOutputAsset.toFixed(2),
      )

      // should create a new instance to update the state
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
  ])

  return swap
}
