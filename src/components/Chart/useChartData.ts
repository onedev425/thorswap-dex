import { useMemo } from 'react'

import { takeRight } from 'lodash'

import { useApp } from 'store/app/hooks'

import { useFormatPrice } from 'helpers/formatPrice'

import { ThemeType } from 'types/app'

import { abbreviateNumber } from './../../helpers/number'
import { getChartData } from './config/chartData'
import { getChartOptions } from './config/chartOptions'
import { parseChartData } from './config/utils'
import { ChartType, ChartTimeFrame, ChartData } from './types'

type Params = {
  chartData: ChartData
  selectedIndex: string
  hideLabel: boolean
  hasGrid: boolean
  chartTimeFrame: ChartTimeFrame
  abbreviateValues?: boolean
}

export const useChartData = ({
  hideLabel,
  hasGrid,
  chartData,
  selectedIndex,
  chartTimeFrame,
  abbreviateValues,
}: Params) => {
  const { themeType } = useApp()

  const {
    loading,
    type = ChartType.Line,
    unit,
    values: selectedChartValues = [],
  } = chartData?.[selectedIndex] || {}
  const formatPrice = useFormatPrice({ prefix: unit })
  const formatter = abbreviateValues
    ? (value: number) => `${unit}${abbreviateNumber(value, 2)}`
    : formatPrice

  const slicedByTime = useMemo(
    () =>
      takeRight(
        selectedChartValues,
        chartTimeFrame === ChartTimeFrame.AllTime ? 60 : 7,
      ),
    [selectedChartValues, chartTimeFrame],
  )

  const { parsedChartData, chartValues } = useMemo(() => {
    const { labels, values } = parseChartData(slicedByTime)

    return {
      chartValues: values,
      parsedChartData: getChartData(
        type,
        labels,
        values,
        themeType === ThemeType.Light,
      ),
    }
  }, [slicedByTime, themeType, type])

  return {
    isChartLoading: loading,
    options: getChartOptions({ formatter, hideLabel, hasGrid, unit }),
    parsedChartData,
    selectedChartType: type,
    values: chartValues,
  }
}
