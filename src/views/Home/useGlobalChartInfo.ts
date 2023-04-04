import { Amount, AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import BigNumber from 'bignumber.js';
import { ChartData, ChartDetail, ChartType } from 'components/Chart/types';
import { runeToAssetPrice } from 'helpers/formatPrice';
import { useMemo } from 'react';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

import {
  LiquidityChartIndex,
  liquidityChartIndexes,
  VolumeChartIndex,
  volumeChartIndexes,
} from './types';

const getFormatter =
  ({ pools, baseCurrency }: { pools: Pool[]; baseCurrency: string }) =>
  (value: string) => {
    const runeAmount = Amount.fromMidgard(value);
    const quoteAsset = AssetEntity.fromAssetString(baseCurrency);

    return runeToAssetPrice({ runeAmount, quoteAsset, pools });
  };

export const useGlobalChartInfo = () => {
  const { baseCurrency } = useApp();
  const {
    isGlobalHistoryLoading,
    earningsHistory,
    swapGlobalHistory,
    liquidityGlobalHistory,
    tvlHistory,
    pools,
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

      const format = getFormatter({ pools, baseCurrency });

      const swapValue = format(data?.totalVolume);
      const addValue = format(liquidityValue?.addLiquidityVolume);
      const withdrawValue = format(liquidityValue?.withdrawVolume);
      const synthValue = format(
        Amount.fromMidgard(data?.synthMintVolume)
          .add(Amount.fromMidgard(data?.synthRedeemVolume))
          .toSignificant(6),
      );
      const total = new BigNumber(data?.totalVolumeUsd).multipliedBy(10 ** -8);

      if (total.toNumber()) {
        totalVolume.push({ time, value: total.toFixed(2) });
      }

      if (swapValue.baseAmount.toNumber()) {
        swapVolume.push({ time, value: swapValue.toCurrencyFormat(2, false) });
      }

      if (addValue.baseAmount.toNumber()) {
        addVolume.push({ time, value: addValue.toCurrencyFormat(2, false) });
      }

      if (withdrawValue.baseAmount.toNumber()) {
        withdrawVolume.push({
          time,
          value: withdrawValue.toCurrencyFormat(2, false),
        });
      }

      if (synthValue.baseAmount.toNumber()) {
        synthVolume.push({ time, value: synthValue.toCurrencyFormat(2, false) });
      }
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
    pools,
    baseCurrency,
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
      const format = getFormatter({ pools, baseCurrency });

      const tvlValue = tvlData[index];

      // HOTFIX: ignore liquidity value if it's less than zero
      // should be removed when it gets fixed on midgard side
      if (parseFloat(tvlValue?.totalValuePooled) > 0) {
        const liquidityValue = format(tvlValue?.totalValuePooled);
        liquidity.push({ time, value: liquidityValue.toCurrencyFormat(2, false) });
      }

      const bondingValue = format(data?.bondingEarnings);
      const liquidityEarningValue = format(data?.liquidityEarnings);

      bondingEarnings.push({
        time,
        value: bondingValue.toCurrencyFormat(2, false),
      });
      liquidityEarning.push({
        time,
        value: liquidityEarningValue.toCurrencyFormat(2, false),
      });
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
    pools,
    baseCurrency,
  ]);

  return { unit: chartValueUnit, volumeChartData, liquidityChartData };
};
