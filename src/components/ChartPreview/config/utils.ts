import type { Chart } from "chart.js";

type ColorType = "background" | "stroke";

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

      const isBackground: boolean = colorType === "background";

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
