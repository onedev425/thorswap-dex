import { Box } from "components/Atomic";
import { Chart } from "components/Chart";
import type { ChartData, ChartDetail } from "components/Chart/types";
import { ChartType } from "components/Chart/types";
import dayjs from "dayjs";
import { memo, useMemo, useState } from "react";
import { t } from "services/i18n";
import { useApp } from "store/app/hooks";
import {
  useGetHistoryEarningsQuery,
  useGetHistoryLiquidityChangesQuery,
  useGetHistorySwapsQuery,
  useGetHistoryTvlQuery,
} from "store/midgard/api";

import {
  LiquidityChartIndex,
  VolumeChartIndex,
  liquidityChartIndexes,
  volumeChartIndexes,
} from "./types";

export const parseBaseValueToNumber = (value = "0") => Number.parseInt(value) / 1e8;

export const GlobalChart = memo(() => {
  const { hideCharts } = useApp();

  const { isLoading: swapGlobalLoading, data: swapGlobalHistory } = useGetHistorySwapsQuery({});
  const { isLoading: liquidityLoading, data: liquidityHistory } =
    useGetHistoryLiquidityChangesQuery({});
  const { isLoading: earningsLoading, data: earningsHistory } = useGetHistoryEarningsQuery({});
  const { isLoading: tvlLoading, data: tvlHistory } = useGetHistoryTvlQuery({});

  const initialChartData = useMemo(() => {
    const defaultData = { values: [], loading: true };

    return [...volumeChartIndexes, ...liquidityChartIndexes].reduce((acc, chartIndex) => {
      acc[chartIndex] = defaultData;
      return acc;
    }, {} as ChartData);
  }, []);

  const [volumeChartIndex, setVolumeChartIndex] = useState<string>(VolumeChartIndex.Swap);
  const [liquidityChartIndex, setLiquidityChartIndex] = useState<string>(
    LiquidityChartIndex.Liquidity,
  );

  const volumeChartData = useMemo(() => {
    if (swapGlobalLoading || liquidityLoading) return initialChartData;

    const swapIntervals = swapGlobalHistory?.intervals || [];
    const liquidityIntervals = liquidityHistory?.intervals;

    const swapVolume: ChartDetail[] = [];
    const lpAddVolume: ChartDetail[] = [];
    const lpWithdrawVolume: ChartDetail[] = [];
    const synthsVolume: ChartDetail[] = [];

    swapIntervals.forEach((item, index) => {
      const { addLiquidityVolume, withdrawVolume } = liquidityIntervals?.[index] || {};
      const lpAddValue = parseBaseValueToNumber(addLiquidityVolume);
      const lpWithdrawValue = parseBaseValueToNumber(withdrawVolume);
      const synthValue =
        (parseBaseValueToNumber(item.synthMintVolume) +
          parseBaseValueToNumber(item.synthRedeemVolume)) *
        Number.parseFloat(item.runePriceUSD);
      const totalValue = parseBaseValueToNumber(item.totalVolumeUsd);
      const time = dayjs.unix(Number.parseInt(item.startTime)).format("MMM DD");

      synthsVolume.push({ time, value: synthValue });
      swapVolume.push({ time, value: totalValue });
      lpAddVolume.push({ time, value: lpAddValue });
      lpWithdrawVolume.push({ time, value: lpWithdrawValue });
    });

    return {
      [VolumeChartIndex.Swap]: { values: swapVolume, unit: "$", type: ChartType.Bar },
      [VolumeChartIndex.Add]: { values: lpAddVolume, unit: "$", type: ChartType.Bar },
      [VolumeChartIndex.Synth]: { values: synthsVolume, unit: "$", type: ChartType.Bar },
      [VolumeChartIndex.Withdraw]: { values: lpWithdrawVolume, unit: "$", type: ChartType.Bar },
    };
  }, [
    initialChartData,
    liquidityHistory?.intervals,
    liquidityLoading,
    swapGlobalHistory?.intervals,
    swapGlobalLoading,
  ]);

  const liquidityChartData = useMemo(() => {
    if (tvlLoading || earningsLoading) return initialChartData;

    const earningsData = earningsHistory.intervals || [];
    const tvlData = tvlHistory?.intervals || [];

    const liquidityEarning: ChartDetail[] = [];
    const liquidity: ChartDetail[] = [];
    const bondingEarnings: ChartDetail[] = [];

    // @ts-expect-error
    earningsData.forEach((item, index) => {
      const time = dayjs.unix(Number.parseInt(item.startTime)).format("MMM DD");
      // // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      // if (time < 1631664000) return;

      const tvlValue = tvlData[index];
      const runeUSDPrice = Number.parseFloat(tvlValue?.runePriceUSD);
      const liquidityPooled = parseBaseValueToNumber(tvlValue?.totalValuePooled) * runeUSDPrice;
      const bondingValue = parseBaseValueToNumber(item?.bondingEarnings) * runeUSDPrice;
      const liquidityValue = parseBaseValueToNumber(item?.liquidityEarnings) * runeUSDPrice;

      liquidity.push({ time, value: liquidityPooled });
      bondingEarnings.push({ time, value: bondingValue });
      liquidityEarning.push({ time, value: liquidityValue });
    });

    return {
      [LiquidityChartIndex.Liquidity]: { values: liquidity, unit: "$" },
      [LiquidityChartIndex.LpEarning]: { values: liquidityEarning, unit: "$" },
      [LiquidityChartIndex.BondEarning]: { values: bondingEarnings, unit: "$" },
    };
  }, [
    tvlLoading,
    earningsLoading,
    initialChartData,
    earningsHistory?.intervals,
    tvlHistory?.intervals,
  ]);

  if (hideCharts) return null;

  return (
    <Box col className="lg:grid lg:grid-rows-1 lg:grid-cols-2 lg:gap-x-8 w-full box-border">
      <Box className="w-full" flex={1}>
        <Chart
          abbreviateValues
          dataInProgress
          chartData={volumeChartData}
          chartIndexes={volumeChartIndexes}
          selectChart={setVolumeChartIndex}
          selectedIndex={volumeChartIndex}
          title={t("views.home.chart_volume")}
        />
      </Box>

      <Box className="w-full" flex={1}>
        <Chart
          abbreviateValues
          beginAt={0}
          chartData={liquidityChartData}
          chartIndexes={liquidityChartIndexes}
          previewChartType={ChartType.CurvedLine}
          selectChart={setLiquidityChartIndex}
          selectedIndex={liquidityChartIndex}
          title={t("views.home.chart_liquidity")}
        />
      </Box>
    </Box>
  );
});
