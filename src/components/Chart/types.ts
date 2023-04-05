import { ChartData as ReactChartData } from 'chart.js';

export type ChartDetail = { value: string; time: number };

export type DataPoint = { x: string; y: number };

export type ChartValues = ChartDetail[];

export enum ChartType {
  Bar = 'bar',
  Area = 'area',
  Line = 'line',
  CurvedLine = 'curvedLine',
}

export type BarChartType = ReactChartData<ChartType.Bar, DataPoint[], string>;
export type AreaChartType = ReactChartData<ChartType.Line, DataPoint[], string>;
export type LineChartType = ReactChartData<ChartType.Line, number[], string>;
export type CurvedLineChartType = ReactChartData<ChartType.Line, number[], string>;

export type ChartObject = {
  values?: ChartValues;
  loading?: boolean;
  type?: ChartType;
  unit?: string;
};

export type ChartData = {
  [key: string]: ChartObject;
};

export enum ChartTimeFrame {
  Week = 0,
  AllTime = 1,
}

export type ChartProps = {
  chartData: ChartData;
  chartIndexes: string[];
  className?: string;
  hasGrid?: boolean;
  hideLabel?: boolean;
  previewChartType?: ChartType;
  selectChart: (value: string) => void;
  selectedIndex: string;
  title: string;
  abbreviateValues?: boolean;
};
