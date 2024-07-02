import { useFormatPrice } from "helpers/formatPrice";
import useWindowSize from "hooks/useWindowSize";
import { useMemo } from "react";
import { useApp } from "store/app/hooks";
import { ThemeType } from "types/app";

import { abbreviateNumber } from "./../../helpers/number";
import { getChartData } from "./config/chartData";
import { getChartOptions } from "./config/chartOptions";
import type { ChartData } from "./types";
import { ChartTimeFrame, ChartType } from "./types";

type Params = {
  chartData: ChartData;
  selectedIndex: string;
  hideLabel: boolean;
  hasGrid: boolean;
  chartTimeFrame: ChartTimeFrame;
  abbreviateValues?: boolean;
  beginAt?: number;
  dataInProgress?: boolean;
};

export const useChartData = ({
  hideLabel,
  hasGrid,
  chartData,
  selectedIndex,
  chartTimeFrame,
  abbreviateValues,
  beginAt,
  dataInProgress,
}: Params) => {
  const { isMdActive } = useWindowSize();
  const { themeType } = useApp();

  const {
    loading,
    type = ChartType.Line,
    unit,
    values: selectedChartValues = [],
  } = chartData?.[selectedIndex] || {};
  const formatPrice = useFormatPrice(2, unit);
  const formatter = abbreviateValues
    ? (value: number) => `${unit}${abbreviateNumber(value)}`
    : formatPrice;

  const slicedByTime = useMemo(
    () => selectedChartValues.slice(chartTimeFrame === ChartTimeFrame.AllTime ? -60 : -7),
    [selectedChartValues, chartTimeFrame],
  );

  const { parsedChartData, chartValues } = useMemo(() => {
    const { values, labels } = slicedByTime.reduce(
      (acc, item) => {
        acc.values.push(item.value);
        acc.labels.push(item.time);
        return acc;
      },
      {
        values: [] as number[],
        labels: [] as string[],
      },
    );

    return {
      chartValues: values,
      parsedChartData: getChartData(
        type,
        labels,
        values,
        themeType === ThemeType.Light,
        dataInProgress,
      ),
    };
  }, [dataInProgress, slicedByTime, themeType, type]);

  return {
    isChartLoading: loading,
    options: getChartOptions({
      animated: isMdActive,
      formatter,
      hideLabel,
      hasGrid,
      unit,
      beginAt,
    }),
    parsedChartData,
    selectedChartType: type,
    values: chartValues,
  };
};
