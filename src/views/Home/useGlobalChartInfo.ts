import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { ChartData, ChartDetail, ChartType } from 'components/Chart/types';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useCallback, useMemo } from 'react';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

import {
  LiquidityChartIndex,
  liquidityChartIndexes,
  VolumeChartIndex,
  volumeChartIndexes,
} from './types';

export const useGlobalChartInfo = () => {
  const runeToCurrency = useRuneToCurrency(false);

  const formatFromRune = useCallback(
    (value: string) => runeToCurrency(Amount.fromMidgard(value)),
    [runeToCurrency],
  );

  const { baseCurrency } = useApp();
  const {
    isGlobalHistoryLoading,
    earningsHistory,
    swapGlobalHistory,
    liquidityGlobalHistory,
    tvlHistory,
  } = useMidgard();

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
    if (isGlobalHistoryLoading || !swapGlobalHistory || !liquidityGlobalHistory) {
      return initialChartData;
    }

    const swapData = swapGlobalHistory.intervals || [];
    const liquidityData = liquidityGlobalHistory.intervals || [];

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
    liquidityGlobalHistory,
    chartValueUnit,
    initialChartData,
    formatFromRune,
    runeToCurrency,
  ]);

  const liquidityChartData: ChartData = useMemo(() => {
    if (isGlobalHistoryLoading || !earningsHistory || !liquidityGlobalHistory) {
      return initialChartData;
    }

    const earningsData = earningsHistory.intervals || [];
    const tvlData = tvlHistory?.intervals || [];

    const liquidityEarning: ChartDetail[] = [];
    const liquidity: ChartDetail[] = [];
    const bondingEarnings: ChartDetail[] = [];

    earningsData.forEach((data, index) => {
      // don't include historical data for the last day
      if (index === earningsData.length - 1) {
        return;
      }

      const time = Number(data?.startTime ?? 0);

      // Wed Sep 15 2021 00:00:00 GMT+0000 (https://www.unixtimestamp.com)
      if (time < 1631664000) return;

      const tvlValue = tvlData[index];

      // HOTFIX: ignore liquidity value if it's less than zero
      // should be removed when it gets fixed on midgard side

      const liquidityPooled = formatFromRune(tvlValue?.totalValuePooled);
      const bondingValue = formatFromRune(data?.bondingEarnings);
      const liquidityValue = formatFromRune(data?.liquidityEarnings);

      parseInt(tvlValue?.totalValuePooled) > 0 && liquidity.push({ time, value: liquidityPooled });
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
    liquidityGlobalHistory,
    tvlHistory?.intervals,
    chartValueUnit,
    initialChartData,
    formatFromRune,
  ]);

  return { unit: chartValueUnit, volumeChartData, liquidityChartData };
};
