import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import type { ChartData, ChartDetail } from 'components/Chart/types';
import { ChartType } from 'components/Chart/types';
import { useRuneAtTimeToCurrency, useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useCallback, useMemo } from 'react';
import { useApp } from 'store/app/hooks';
import {
  useGetHistoryEarningsQuery,
  useGetHistoryLiquidityChangesQuery,
  useGetHistorySwapsQuery,
  useGetHistoryTvlQuery,
} from 'store/midgard/api';

import {
  LiquidityChartIndex,
  liquidityChartIndexes,
  VolumeChartIndex,
  volumeChartIndexes,
} from './types';

export const useGlobalChartInfo = () => {
  const runeToCurrency = useRuneToCurrency(false);
  const runeToCurrencyAtTime = useRuneAtTimeToCurrency(false);

  const formatFromRune = useCallback(
    (value: string) => runeToCurrency(Amount.fromMidgard(value)),
    [runeToCurrency],
  );
  const formatFromRuneAtTime = useCallback(
    (value: string, runePrice: string) =>
      runeToCurrencyAtTime(Amount.fromMidgard(value), runePrice),
    [runeToCurrencyAtTime],
  );

  const { baseCurrency } = useApp();
  const { isLoading: isGlobalHistoryLoading, data: swapGlobalHistory } = useGetHistorySwapsQuery();
  const { data: liquidityHistory } = useGetHistoryLiquidityChangesQuery();
  const { data: earningsHistory } = useGetHistoryEarningsQuery();
  const { data: tvlHistory } = useGetHistoryTvlQuery();

  const chartValueUnit = useMemo(() => {
    const baseCurrencyAsset = AssetEntity.fromAssetString(baseCurrency);

    if (!baseCurrencyAsset || baseCurrencyAsset?.isRUNE()) return 'ᚱ';
    if (baseCurrencyAsset?.ticker === 'USD') return '$';

    return baseCurrencyAsset.ticker;
  }, [baseCurrency]);

  const initialChartData = useMemo(() => {
    const defaultData = { values: [], loading: true };

    return [...volumeChartIndexes, ...liquidityChartIndexes].reduce((acc, chartIndex) => {
      acc[chartIndex] = defaultData;
      return acc;
    }, {} as ChartData);
  }, []);

  const volumeChartData: ChartData = useMemo(() => {
    if (isGlobalHistoryLoading || !swapGlobalHistory || !liquidityHistory) {
      return initialChartData;
    }

    const swapData = swapGlobalHistory.intervals || [];
    const liquidityData = liquidityHistory.intervals || [];

    const totalVolume: ChartDetail[] = [];
    const swapVolume: ChartDetail[] = [];
    const addVolume: ChartDetail[] = [];
    const withdrawVolume: ChartDetail[] = [];
    const synthVolume: ChartDetail[] = [];

    swapData.forEach((data, index) => {
      const liquidityValue = liquidityData[index];
      const time = Number(data?.startTime ?? 0);

      // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      if (time < 1631664000) return;

      const swapValue = formatFromRune(data?.totalVolume);
      const addValue = formatFromRune(liquidityValue?.addLiquidityVolume);
      const withdrawValue = formatFromRune(liquidityValue?.withdrawVolume);
      const synthValue = runeToCurrency(
        Amount.fromMidgard(data?.synthMintVolume).add(Amount.fromMidgard(data?.synthRedeemVolume)),
      );
      const total = new BigNumber(data?.totalVolumeUsd).multipliedBy(10 ** -8);

      if (total.toNumber()) totalVolume.push({ time, value: total.toFixed(2) });

      swapVolume.push({ time, value: swapValue });
      addVolume.push({ time, value: addValue });
      withdrawVolume.push({ time, value: withdrawValue });
      synthVolume.push({ time, value: synthValue });
    });

    return {
      [VolumeChartIndex.Total]: {
        values: totalVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Swap]: {
        values: swapVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Add]: {
        values: addVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Synth]: {
        values: synthVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
      [VolumeChartIndex.Withdraw]: {
        values: withdrawVolume,
        unit: chartValueUnit,
        type: ChartType.Bar,
      },
    };
  }, [
    isGlobalHistoryLoading,
    swapGlobalHistory,
    liquidityHistory,
    chartValueUnit,
    initialChartData,
    formatFromRune,
    runeToCurrency,
  ]);

  const liquidityChartData: ChartData = useMemo(() => {
    if (isGlobalHistoryLoading || !earningsHistory) {
      return initialChartData;
    }

    const earningsData = earningsHistory.intervals || [];
    const tvlData = tvlHistory?.intervals || [];

    const liquidityEarning: ChartDetail[] = [];
    const liquidity: ChartDetail[] = [];
    const bondingEarnings: ChartDetail[] = [];

    // @ts-expect-error
    earningsData.forEach((data, index) => {
      const time = Number(data?.startTime ?? 0);
      // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      if (time < 1631664000) return;

      const tvlValue = tvlData[index];
      const liquidityPooled = formatFromRuneAtTime(
        tvlValue?.totalValuePooled,
        tvlValue?.runePriceUSD,
      );

      parseInt(tvlValue?.totalValuePooled) > 0 && liquidity.push({ time, value: liquidityPooled });

      // don't include historical data for the last day for swaps
      if (index === earningsData.length - 1) {
        return;
      }

      // HOTFIX: ignore liquidity value if it's less than zero
      // should be removed when it gets fixed on midgard side

      const bondingValue = formatFromRune(data?.bondingEarnings);
      const liquidityValue = formatFromRune(data?.liquidityEarnings);

      bondingEarnings.push({ time, value: bondingValue });
      liquidityEarning.push({ time, value: liquidityValue });
    });

    return {
      [LiquidityChartIndex.Liquidity]: {
        values: liquidity,
        unit: chartValueUnit,
      },
      [LiquidityChartIndex.LpEarning]: {
        values: liquidityEarning,
        unit: chartValueUnit,
      },
      [LiquidityChartIndex.BondEarning]: {
        values: bondingEarnings,
        unit: chartValueUnit,
      },
    };
  }, [
    isGlobalHistoryLoading,
    earningsHistory,
    tvlHistory?.intervals,
    chartValueUnit,
    initialChartData,
    formatFromRune,
    formatFromRuneAtTime,
  ]);

  return { unit: chartValueUnit, liquidityChartData };
};
