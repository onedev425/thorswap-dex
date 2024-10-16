import type { ChartData } from "chart.js";

export type DataPoint = { x: string; y: number };
export enum ChartType {
  Bar = "bar",
  Area = "area",
  Line = "line",
  CurvedLine = "curvedLine",
}

export type CurvedLineChartType = ChartData<ChartType.Line, number[], string>;
