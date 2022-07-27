import { useMemo } from 'react'

import {
  Asset,
  Amount,
  AssetAmount,
  Pool,
  getNetworkFeeByAsset,
} from '@thorswap-lib/multichain-sdk'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'

import { getGasRateByChain, getGasRateByFeeOption } from 'helpers/networkFee'

export const useNetworkFee = ({
  inputAsset,
  outputAsset,
}: {
  inputAsset: Asset
  outputAsset?: Asset
}) => {
  const { feeOptionType } = useApp()
  const { inboundData, pools } = useMidgard()

  const inboundFee = useMemo(() => {
    // get inbound gasRate with fee option

    const gasRate = getGasRateByFeeOption({
      inboundData,
      chain: inputAsset.L1Chain,
      feeOptionType,
    })
    const networkFee = getNetworkFeeByAsset({
      asset: inputAsset,
      gasRate,
      direction: 'inbound',
    })

    return networkFee
  }, [inputAsset, inboundData, feeOptionType])

  const outboundFee = useMemo(() => {
    const asset = outputAsset || inputAsset

    const gasRate = getGasRateByChain({ inboundData, chain: asset.chain })
    const networkFee = getNetworkFeeByAsset({
      asset,
      gasRate,
      direction: 'outbound',
    })

    return networkFee
  }, [outputAsset, inputAsset, inboundData])

  const feeAssets = useMemo(() => {
    if (!outboundFee) return inboundFee.asset.symbol

    if (outboundFee.asset.eq(inboundFee.asset)) return inboundFee.asset.symbol

    return `${outboundFee.asset.symbol}, ${inboundFee.asset.symbol}`
  }, [inboundFee, outboundFee])

  const totalFee = useMemo(() => {
    if (!outboundFee) return inboundFee

    const outboundFeeInSendAsset = new AssetAmount(
      inputAsset,
      Amount.fromAssetAmount(
        outboundFee.totalPriceIn(inputAsset, pools).price,
        inputAsset.decimal,
      ),
    )

    if (inboundFee.asset.eq(inputAsset)) {
      return inboundFee.add(outboundFeeInSendAsset)
    }

    const inboundFeeInSendAsset = new AssetAmount(
      inputAsset,
      Amount.fromAssetAmount(
        inboundFee.totalPriceIn(inputAsset, pools).price,
        inputAsset.decimal,
      ),
    )
    return inboundFeeInSendAsset.add(outboundFeeInSendAsset)
  }, [inputAsset, inboundFee, outboundFee, pools])

  const totalFeeInUSD = useMemo(
    () => outboundFee?.totalPriceIn(Asset.USD(), pools),
    [outboundFee, pools],
  )

  return {
    totalFee,
    inboundFee,
    outboundFee,
    totalFeeInUSD,
    feeAssets,
  }
}

export const getSumAmountInUSD = (
  assetAmount1: AssetAmount | null,
  assetAmount2: AssetAmount | null,
  pools: Pool[],
) => {
  const assetAmount1InUSD = assetAmount1?.totalPriceIn(Asset.USD(), pools)
  const assetAmount2InUSD = assetAmount2?.totalPriceIn(Asset.USD(), pools)

  if (assetAmount1 === null && assetAmount2InUSD)
    return assetAmount2InUSD.toCurrencyFormat(2)
  if (assetAmount2 === null && assetAmount1InUSD)
    return assetAmount1InUSD.toCurrencyFormat(2)

  if (assetAmount1InUSD && assetAmount2InUSD) {
    const sum = assetAmount1InUSD.raw().plus(assetAmount2InUSD.raw())

    return Amount.fromAssetAmount(sum, 8).toFixed(2)
  }

  return Amount.fromAssetAmount(0, 8).toFixed()
}
