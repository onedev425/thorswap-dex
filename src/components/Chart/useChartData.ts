import { useMemo } from 'react'

import { takeRight } from 'lodash'

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
}

export const useChartData = ({
  hideLabel,
  hasGrid,
  chartData,
  selectedIndex,
  chartTimeFrame,
}: Params) => {
  const {
    loading,
    type = ChartType.Line,
    unit,
    values: selectedChartValues = [],
  } = chartData?.[selectedIndex] || {}

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
      parsedChartData: getChartData(type, labels, values),
    }
  }, [slicedByTime, type])

  return {
    isChartLoading: loading,
    options: getChartOptions(hideLabel, hasGrid, unit),
    parsedChartData,
    selectedChartType: type,
    values: chartValues,
  }
}
