import { Chart } from 'chart.js'

import { DataPoint } from 'components/Chart/types'

const getGradientInstance = (
  gradientColor1: string,
  gradientColor2: string,
) => {
  let width: number
  let height: number
  let gradient: { addColorStop: (arg0: number, arg1: string) => void }

  const getGradient = (
    ctx: CanvasRenderingContext2D,
    chartArea: { right: number; left: number; bottom: number; top: number },
  ) => {
    const chartWidth = chartArea.right - chartArea.left
    const chartHeight = chartArea.bottom - chartArea.top
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      width = chartWidth
      height = chartHeight
      gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
      gradient.addColorStop(0, gradientColor1)
      gradient.addColorStop(1, gradientColor2)
    }
    return gradient
  }

  return getGradient
}

export const getLabelsAndValuesFromData = (data: DataPoint[]) => {
  const dataLabels: string[] = []
  const dataValues: number[] = []

  data.forEach((point: DataPoint) => {
    dataLabels.push(point.x)
    dataValues.push(point.y)
  })

  return { dataLabels, dataValues }
}

export const getBackgroundColor = (
  gradientColor1: string,
  gradientColor2: string,
) => {
  return (context: { chart: Chart }) => {
    const {
      chart: { ctx, chartArea },
    } = context
    if (chartArea) {
      return getGradientInstance(gradientColor1, gradientColor2)(ctx, chartArea)
    }
  }
}
