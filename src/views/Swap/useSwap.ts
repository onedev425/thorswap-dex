import { useMemo } from 'react'

import {
  Amount,
  Asset,
  AssetAmount,
  Pool,
  LegacySwap,
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

  const swap: LegacySwap | null = useMemo(() => {
    if (poolLoading || pools.length === 0) return null

    try {
      const inputFeeAmount = Amount.fromAssetAmount(
        inboundFee.totalPriceIn(inputAsset, pools).price,
        inputAsset.decimal,
      )
      const outboundFeeAmount = outboundFee
        ? Amount.fromAssetAmount(
            outboundFee.totalPriceIn(outputAsset, pools).price,
            outputAsset.decimal,
          )
        : Amount.fromAssetAmount(0, outputAsset.decimal)

      const swapParams = {
        inputAsset,
        outputAsset,
        pools,
        slip: slippageTolerance,
        amount: new AssetAmount(inputAsset, inputAmount),
        fee: {
          inboundFee: new AssetAmount(inputAsset, inputFeeAmount),
          outboundFee: new AssetAmount(outputAsset, outboundFeeAmount),
        },
      } as const

      const paramsWithFee = isAffiliated
        ? Object.assign(swapParams, { affiliateFee: DEFAULT_AFFILIATE_FEE })
        : swapParams

      return new LegacySwap(paramsWithFee)
    } catch (error) {
      console.info(error)
      return null
    }
  }, [
    inboundFee,
    inputAmount,
    inputAsset,
    isAffiliated,
    outboundFee,
    outputAsset,
    poolLoading,
    pools,
    slippageTolerance,
  ])

  return swap
}
