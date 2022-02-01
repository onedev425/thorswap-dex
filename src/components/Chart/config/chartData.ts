import * as colors from 'components/Chart/styles/colors'
import { ChartType, DataPoint } from 'components/Chart/types'

import { getBackgroundColor, getLabelsAndValuesFromData } from './utils'

const getDataForBarChart = (data: DataPoint[], dataLabels: string[]) => {
  return {
    type: 'bar',
    label: dataLabels,
    datasets: [
      {
        label: '',
        data: data,
        backgroundColor: getBackgroundColor(
          colors.barChartGradientColor1,
          colors.barChartGradientColor2,
        ),
        borderWidth: 0,
        borderRadius: 100,
        borderSkipped: false,
        barThickness: 6,
      },
    ],
  }
}

const getDataForAreaChart = (data: DataPoint[], dataLabels: string[]) => {
  return {
    type: 'line',
    label: dataLabels,
    datasets: [
      {
        label: '',
        data: data,
        backgroundColor: getBackgroundColor(
          colors.areaChartGradientColor1,
          colors.areaChartGradientColor2,
        ),
        borderColor: colors.areaChartBorderColor,
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

const getDataForLineChart = (dataLabels: string[], dataValues: number[]) => {
  return {
    type: 'line',
    labels: dataLabels,
    datasets: [
      {
        data: dataValues,
        label: '',
        backgroundColor: getBackgroundColor(
          colors.lineChartGradientColor1,
          colors.lineChartGradientColor2,
        ),
        borderColor: colors.lineChartBorderColor,
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
) => {
  return {
    type: 'line',
    labels: dataLabels,
    datasets: [
      {
        label: '',
        backgroundColor: getBackgroundColor(
          colors.curvedLineChartGradientColor1,
          colors.curvedLineChartGradientColor2,
        ),
        borderColor: colors.curvedLineChartBorderColor,
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
    case 'bar':
      return getDataForBarChart(data, dataLabels)
    case 'area':
      return getDataForAreaChart(data, dataLabels)
    case 'line':
      return getDataForLineChart(dataLabels, dataValues)
    case 'curved-line':
      return getDataForCurvedLineChart(dataLabels, dataValues)
    default:
      return null
  }
}
