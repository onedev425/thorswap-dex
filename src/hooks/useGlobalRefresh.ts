import type { HistoryInterval, PoolPeriods } from '@thorswap-lib/midgard-sdk';
import useInterval from 'hooks/useInterval';
import { useCallback, useRef } from 'react';
import { batch } from 'react-redux';
import { POLL_DATA_INTERVAL, POLL_GAS_RATE_INTERVAL } from 'settings/constants';
import {
  getEarningsHistory,
  getLastblock,
  getLiquidityHistory,
  getMimir,
  getNetworkData,
  getPools,
  getQueue,
  getStats,
  getSwapHistory,
  getThorchainInboundData,
  getTVLHistory,
  getVolume24h,
} from 'store/midgard/actions';
import { useAppDispatch } from 'store/store';

import { useEffectOnce } from './useEffectOnce';

/**
 * hooks for reloading all data
 * NOTE: useRefresh hooks should be imported and used only once, to avoid multiple usage of useInterval
 */

const MAX_HISTORY_COUNT = 100;
const PER_DAY = 'day' as HistoryInterval;
const periods: PoolPeriods[] = ['180d', '100d', '90d', '30d', '7d', '24h', '1h'];

export const useGlobalRefresh = () => {
  const isLoading = useRef(false);
  const appDispatch = useAppDispatch();

  const loadInitialData = useCallback(async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    batch(() => {
      appDispatch(getVolume24h());
      appDispatch(getStats());
      appDispatch(getNetworkData());
      appDispatch(getLastblock());
      appDispatch(getMimir());
      appDispatch(getQueue());
    });

    await appDispatch(getPools(periods[0]));

    isLoading.current = false;
    for (const period of periods.slice(1)) {
      await appDispatch(getPools(period));
    }
  }, [appDispatch]);

  const refreshPage = useCallback(
    (route = undefined) => {
      if (!route) {
        loadInitialData();
      } else {
        appDispatch(getMimir());
        appDispatch(getStats());
      }
    },
    [loadInitialData, appDispatch],
  );

  const getGlobalHistory = useCallback(() => {
    // fetch historical data till past day
    const query = { interval: PER_DAY, count: MAX_HISTORY_COUNT };

    batch(() => {
      appDispatch(getEarningsHistory(query));
      appDispatch(getTVLHistory(query));
      appDispatch(getSwapHistory({ query }));
      appDispatch(getLiquidityHistory({ query }));
    });
  }, [appDispatch]);

  useEffectOnce(() => {
    refreshPage();
    appDispatch(getThorchainInboundData());
    getGlobalHistory();
  });

  useInterval(() => {
    appDispatch(getThorchainInboundData());
  }, POLL_GAS_RATE_INTERVAL);

  useInterval(() => {
    refreshPage();
  }, POLL_DATA_INTERVAL);
};
