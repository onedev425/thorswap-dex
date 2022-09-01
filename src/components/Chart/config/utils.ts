import { Chart } from 'chart.js';
import dayjs from 'dayjs';
import random from 'lodash/random';

type ColorType = 'background' | 'stroke';

const getGradientInstance = (gradientColors: string[], colorType: ColorType) => {
  let width: number;
  let height: number;
  let gradient: { addColorStop: (arg0: number, arg1: string) => void };

  const getGradient = (
    ctx: CanvasRenderingContext2D,
    chartArea: { right: number; left: number; bottom: number; top: number },
  ) => {
    const chartWidth = chartArea.right - chartArea.left;
    const chartHeight = chartArea.bottom - chartArea.top;
    if (!gradient || width !== chartWidth || height !== chartHeight) {
      width = chartWidth;
      height = chartHeight;

      const isBackground: boolean = colorType === 'background';

      const bottom: number = isBackground ? chartArea.bottom : 0;
      const top: number = isBackground ? chartArea.top : 0;
      const strokeWidth: number = isBackground ? 0 : width;

      gradient = ctx.createLinearGradient(0, bottom, strokeWidth, top);
      for (let i = 0; i < gradientColors.length; i++) {
        const stopValue = i === gradientColors.length - 1 ? 1 : i / gradientColors.length;

        gradient.addColorStop(stopValue, gradientColors[i]);
      }
    }
    return gradient;
  };

  return getGradient;
};

export const getColor = (gradientColors: string[], colorType: ColorType) => {
  return (context: { chart: Chart }) => {
    const {
      chart: { ctx, chartArea },
    } = context;
    if (chartArea) {
      return getGradientInstance(gradientColors, colorType)(ctx, chartArea);
    }
  };
};

export const generateRandomTimeSeries = (minValue: number, maxValue: number) => {
  const labels: string[] = [];
  const values: number[] = [];
  for (let date = dayjs().subtract(30, 'days'); date.isBefore(dayjs()); date = date.add(1, 'day')) {
    labels.push(date.format('MMM DD'));
    values.push(minValue + (random(100) / 100) * (maxValue - minValue));
  }

  return { labels, values };
};

export const parseChartData = (chartData: { value: string; time: number }[]) =>
  chartData.reduce(
    (acc, { time, value }) => {
      const [amount] = value.split(' ');
      acc.labels.push(dayjs.unix(time).format('MMM DD'));
      acc.values.push(Number(amount.replace('$', '').split(',').join('')));
      return acc;
    },
    { labels: [] as string[], values: [] as number[] },
  );

export const getRandomChartData = () => generateRandomTimeSeries(0, 100);
