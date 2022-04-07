import { useMemo } from 'react'

import { Amount, Asset } from '@thorswap-lib/multichain-sdk'

import {
  ChartData,
  ChartDetail,
  ChartType,
  ChartValues,
} from 'components/Chart/types'

import { useApp } from 'store/app/hooks'
import { useMidgard } from 'store/midgard/hooks'

import { volumeChartIndexes, liquidityChartIndexes } from './types'

export const useGlobalChartInfo = () => {
  const { baseCurrency } = useApp()

  const {
    isGlobalHistoryLoading,
    earningsHistory,
    swapGlobalHistory,
    liquidityGlobalHistory,
    tvlHistory,
  } = useMidgard()

  const chartValueUnit = useMemo(() => {
    const baseCurrencyAsset = Asset.fromAssetString(baseCurrency)
    if (!baseCurrencyAsset) return 'ᚱ'

    if (baseCurrencyAsset?.isRUNE()) return 'ᚱ'
    if (baseCurrencyAsset?.ticker === 'USD') return '$'

    return baseCurrencyAsset.ticker
  }, [baseCurrency])

  const initialChartData = useMemo(() => {
    const initialData: ChartData = {}
    const defaultChartValues: ChartValues = []

    const chartIndexes = [...volumeChartIndexes, ...liquidityChartIndexes]

    chartIndexes.forEach((chartIndex) => {
      initialData[chartIndex] = {
        values: defaultChartValues,
        loading: true,
      }
    })

    return initialData
  }, [])

  const volumeChartData: ChartData = useMemo(() => {
    if (
      isGlobalHistoryLoading ||
      !swapGlobalHistory ||
      !liquidityGlobalHistory
    ) {
      return initialChartData
    }

    const swapData = swapGlobalHistory.intervals || []
    const liquidityData = liquidityGlobalHistory.intervals || []

    const totalVolume: ChartDetail[] = []
    const swapVolume: ChartDetail[] = []
    const addVolume: ChartDetail[] = []
    const withdrawVolume: ChartDetail[] = []
    const synthVolume: ChartDetail[] = []

    swapData.forEach((data, index) => {
      // don't include historical data for the last day
      if (index === swapData.length - 1) {
        return
      }

      const liquidityValue = liquidityData[index]
      const time = Number(data?.startTime ?? 0)

      // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      if (time < 1631664000) return

      const swapValue = Amount.fromMidgard(data?.totalVolume).mul(
        Amount.fromNormalAmount(data?.runePriceUSD),
      )
      const addValue = Amount.fromMidgard(
        liquidityValue?.addLiquidityVolume,
      ).mul(Amount.fromNormalAmount(data?.runePriceUSD))
      const withdrawValue = Amount.fromMidgard(
        liquidityValue?.withdrawVolume,
      ).mul(Amount.fromNormalAmount(data?.runePriceUSD))
      const synthValue = Amount.fromMidgard(data?.synthMintVolume)
        .add(Amount.fromMidgard(data?.synthRedeemVolume))
        .mul(Amount.fromNormalAmount(data?.runePriceUSD))

      const total = swapValue.add(addValue).add(withdrawValue)

      if (total.baseAmount.toNumber())
        totalVolume.push({
          time,
          value: total.toFixed(0),
        })

      if (swapValue.baseAmount.toNumber())
        swapVolume.push({
          time,
          value: swapValue.toFixed(0),
        })

      if (addValue.baseAmount.toNumber())
        addVolume.push({
          time,
          value: addValue.toFixed(0),
        })

      if (withdrawValue.baseAmount.toNumber())
        withdrawVolume.push({
          time,
          value: withdrawValue.toFixed(0),
        })

      if (synthValue.baseAmount.toNumber())
        synthVolume.push({
          time,
          value: synthValue.toFixed(0),
        })
    })

    return {
      Total: {
        values: totalVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      Swap: {
        values: swapVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      Add: {
        values: addVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      Withdraw: {
        values: withdrawVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      Synth: {
        values: synthVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
    }
  }, [
    swapGlobalHistory,
    liquidityGlobalHistory,
    isGlobalHistoryLoading,
    initialChartData,
    chartValueUnit,
  ])

  const liquidityChartData: ChartData = useMemo(() => {
    if (isGlobalHistoryLoading || !earningsHistory || !liquidityGlobalHistory) {
      return initialChartData
    }

    const earningsData = earningsHistory.intervals || []
    const tvlData = tvlHistory?.intervals || []

    // const tvl: ChartDetail[] = []
    const runePrice: ChartDetail[] = []
    const liquidityEarning: ChartDetail[] = []
    const liquidity: ChartDetail[] = []
    // const ILPaid: ChartDetail[] = []
    const bondingEarnings: ChartDetail[] = []

    earningsData.forEach((data, index) => {
      // don't include historical data for the last day
      if (index === earningsData.length - 1) {
        return
      }

      const time = Number(data?.startTime ?? 0)

      // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      if (time < 1631664000) return

      const tvlValue: FixMe = tvlData[index]

      liquidity.push({
        time,
        value: Amount.fromMidgard(tvlValue?.totalValuePooled)
          .mul(Amount.fromNormalAmount(tvlValue?.runePriceUSD))
          .toFixed(0),
      })

      bondingEarnings.push({
        time,
        value: Amount.fromMidgard(data?.bondingEarnings)
          .mul(Amount.fromNormalAmount(data?.runePriceUSD))
          .toFixed(0),
      })

      runePrice.push({
        time,
        value: Amount.fromNormalAmount(data?.runePriceUSD).toFixed(2),
      })

      liquidityEarning.push({
        time,
        value: Amount.fromMidgard(data?.liquidityEarnings)
          .mul(Amount.fromNormalAmount(data?.runePriceUSD))
          .toFixed(0),
      })
    })

    return {
      Liquidity: {
        values: liquidity,
        unit: '$',
      },
      'LP Earning': {
        values: liquidityEarning,
        unit: chartValueUnit,
      },
      'Bond Earning': {
        values: bondingEarnings,
        unit: chartValueUnit,
      },
    }
  }, [
    tvlHistory,
    liquidityGlobalHistory,
    earningsHistory,
    isGlobalHistoryLoading,
    initialChartData,
    chartValueUnit,
  ])

  return {
    volumeChartData,
    liquidityChartData,
  }
}
