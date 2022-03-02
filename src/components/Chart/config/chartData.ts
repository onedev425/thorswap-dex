import * as colors from 'components/Chart/styles/colors'
import {
  AreaChartType,
  BarChartType,
  ChartType,
  CurvedLineChartType,
  DataPoint,
  LineChartType,
} from 'components/Chart/types'

import { getColor, getLabelsAndValuesFromData } from './utils'

const StrokeColors = [
  colors.StrokeColor1,
  colors.StrokeColor2,
  colors.StrokeColor3,
  colors.StrokeColor4,
  colors.StrokeColor5,
]

const getDataForBarChart = (
  data: DataPoint[],
  dataLabels: string[],
): BarChartType => {
  return {
    labels: dataLabels,
    datasets: [
      {
        label: '',
        data: data,
        backgroundColor: getColor(
          [colors.barChartGradientColor1, colors.barChartGradientColor2],
          'background',
        ),
        borderWidth: 0,
        borderRadius: 100,
        borderSkipped: false,
        barThickness: 6,
      },
    ],
  }
}

const getDataForAreaChart = (
  data: DataPoint[],
  dataLabels: string[],
): AreaChartType => {
  return {
    labels: dataLabels,
    datasets: [
      {
        label: '',
        data: data,
        backgroundColor: getColor(
          [colors.areaChartGradientColor2, colors.areaChartGradientColor1],
          'background',
        ),
        borderColor: getColor(StrokeColors, 'stroke'),
        borderWidth: 3,
        fill: true,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        pointStyle: 'circle',
        pointRadius: 6,
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointBorderWidth: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 4,
        pointHoverBackgroundColor: colors.areaChartPointHoverBackgroundColor,
        pointHoverBorderColor: colors.areaChartPointHoverBorderColor,
      },
    ],
  }
}

const getDataForLineChart = (
  dataLabels: string[],
  dataValues: number[],
): LineChartType => {
  return {
    labels: dataLabels,
    datasets: [
      {
        data: dataValues,
        label: '',
        backgroundColor: getColor(
          [colors.lineChartGradientColor1, colors.lineChartGradientColor2],
          'background',
        ),
        borderColor: getColor(StrokeColors, 'stroke'),
        borderWidth: 3,
        fill: true,
        cubicInterpolationMode: 'default',
        tension: 0,
        pointStyle: 'circle',
        pointRadius: 6,
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointBorderWidth: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 4,
        pointHoverBackgroundColor: colors.lineChartPointHoverBackgroundColor,
        pointHoverBorderColor: colors.lineChartPointHoverBorderColor,
      },
    ],
  }
}

const getDataForCurvedLineChart = (
  dataLabels: string[],
  dataValues: number[],
): CurvedLineChartType => {
  return {
    labels: dataLabels,
    datasets: [
      {
        label: '',
        backgroundColor: getColor(
          [
            colors.curvedLineChartGradientColor1,
            colors.curvedLineChartGradientColor2,
          ],
          'background',
        ),
        borderColor: getColor(StrokeColors, 'stroke'),
        borderWidth: 3,
        data: dataValues,
        fill: true,
        cubicInterpolationMode: 'default',
        tension: 0.4,
        pointStyle: 'circle',
        pointRadius: 6,
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        pointBorderWidth: 4,
        pointHoverRadius: 6,
        pointHoverBorderWidth: 4,
        pointHoverBackgroundColor:
          colors.curvedLineChartPointHoverBackgroundColor,
        pointHoverBorderColor: colors.curvedLineChartPointHoverBorderColor,
      },
    ],
  }
}

export const getChartData = (type: ChartType, data: DataPoint[]) => {
  const { dataLabels, dataValues } = getLabelsAndValuesFromData(data)

  switch (type) {
    case ChartType.Bar:
      return getDataForBarChart(data, dataLabels)
    case ChartType.Area:
      return getDataForAreaChart(data, dataLabels)
    case ChartType.Line:
      return getDataForLineChart(dataLabels, dataValues)
    case ChartType.CurvedLine:
      return getDataForCurvedLineChart(dataLabels, dataValues)
  }
}
