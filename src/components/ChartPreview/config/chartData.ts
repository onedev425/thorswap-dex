import * as colors from '../styles/colors'
import { CurvedLineChartType } from '../types'
import { getColor } from './utils'

const primaryStrokeColors = [
  colors.StrokeColor1,
  colors.StrokeColor2,
  colors.StrokeColor3,
  colors.StrokeColor4,
  colors.StrokeColor5,
]

const secondaryStrokeColors = [colors.StrokeColor6, colors.StrokeColor7]

export const getDataForCurvedLineChart = (
  dataLabels: string[],
  dataValues: number[],
): CurvedLineChartType => {
  const isGreen = dataValues[dataValues.length - 1] >= dataValues[0]

  const activeStrokeColors = isGreen
    ? primaryStrokeColors
    : secondaryStrokeColors
  const activeBgColors = isGreen
    ? [
        colors.curvedLineChartGradientColor1,
        colors.curvedLineChartGradientColor2,
      ]
    : [
        colors.curvedLineChartGradientColor3,
        colors.curvedLineChartGradientColor4,
      ]

  return {
    labels:
      dataLabels.length === 1
        ? Array(dataValues.length).fill(dataLabels[0])
        : dataLabels,
    datasets: [
      {
        label: '',
        backgroundColor: getColor(activeBgColors, 'background'),
        borderColor: getColor(activeStrokeColors, 'stroke'),
        borderWidth: 2,
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
