import { useMemo, useState } from 'react'

import { Amount, Asset } from '@thorswap-lib/multichain-sdk'

import { Box } from 'components/Atomic'
import { Chart } from 'components/Chart'
import {
  ChartData,
  ChartDetail,
  ChartType,
  ChartValues,
} from 'components/Chart/types'

import { useApp } from 'redux/app/hooks'
import { useGlobalState } from 'redux/hooks'
import { useMidgard } from 'redux/midgard/hooks'

import { t } from 'services/i18n'

import { volumeChartIndexes, liquidityChartIndexes } from './types'

export const GlobalChart = () => {
  const { baseCurrency } = useApp()
  const { runeToCurrency } = useGlobalState()

  const {
    isGlobalHistoryLoading,
    earningsHistory,
    swapGlobalHistory,
    liquidityGlobalHistory,
    tvlHistory,
  } = useMidgard()

  const [volumeChartIndex, setVolumeChartIndex] = useState('Total')
  const [liquidityChartIndex, setLiquidityChartIndex] = useState('Liquidity')

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

    swapData.forEach((data, index) => {
      // don't include historical data for the last day
      if (index === swapData.length - 1) {
        return
      }

      const liquidityValue = liquidityData[index]
      const time = Number(data?.startTime ?? 0)

      // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      if (time < 1631664000) return

      const swapValue = Amount.fromMidgard(data?.totalVolume)
      const addValue = Amount.fromMidgard(liquidityValue?.addLiquidityVolume)
      const withdrawValue = Amount.fromMidgard(liquidityValue?.withdrawVolume)

      const total = swapValue.add(addValue).add(withdrawValue)

      if (total.baseAmount.toNumber())
        totalVolume.push({
          time,
          value: runeToCurrency(total).toFixedRaw(0),
        })

      if (swapValue.baseAmount.toNumber())
        swapVolume.push({
          time,
          value: runeToCurrency(swapValue).toFixedRaw(0),
        })

      if (addValue.baseAmount.toNumber())
        addVolume.push({
          time,
          value: runeToCurrency(addValue).toFixedRaw(0),
        })

      if (withdrawValue.baseAmount.toNumber())
        withdrawVolume.push({
          time,
          value: runeToCurrency(withdrawValue).toFixedRaw(0),
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
    }
  }, [
    swapGlobalHistory,
    liquidityGlobalHistory,
    isGlobalHistoryLoading,
    initialChartData,
    chartValueUnit,
    runeToCurrency,
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
        value: runeToCurrency(
          Amount.fromMidgard(data?.bondingEarnings),
        ).toFixedRaw(0),
      })

      runePrice.push({
        time,
        value: Amount.fromNormalAmount(data?.runePriceUSD).toFixed(2),
      })
      liquidityEarning.push({
        time,
        value: runeToCurrency(
          Amount.fromMidgard(data?.liquidityEarnings),
        ).toFixedRaw(0),
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
      // '$RUNE Price': {
      //   values: runePrice,
      //   unit: '$',
      // },
    }
  }, [
    tvlHistory,
    liquidityGlobalHistory,
    earningsHistory,
    isGlobalHistoryLoading,
    initialChartData,
    chartValueUnit,
    runeToCurrency,
  ])

  return (
    <Box className="flex-col flex-wrap lg:space-x-8 lg:flex-row">
      <Box className="flex-1">
        <Chart
          title={t('views.home.chart.volume')}
          chartIndexes={volumeChartIndexes}
          chartData={volumeChartData}
          selectedIndex={volumeChartIndex}
          selectChart={setVolumeChartIndex}
        />
      </Box>
      <Box className="flex-1">
        <Chart
          title={t('views.home.chart.liquidity')}
          chartIndexes={liquidityChartIndexes}
          chartData={liquidityChartData}
          selectedIndex={liquidityChartIndex}
          selectChart={setLiquidityChartIndex}
        />
      </Box>
    </Box>
  )
}
