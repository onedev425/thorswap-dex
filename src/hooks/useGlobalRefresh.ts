import type { HistoryInterval } from '@thorswap-lib/midgard-sdk';
import useInterval from 'hooks/useInterval';
import { useCallback, useRef } from 'react';
import { batch } from 'react-redux';
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
  getTVLHistory,
  getVolume24h,
} from 'store/midgard/actions';
import { useAppDispatch } from 'store/store';

import { useEffectOnce } from './useEffectOnce';

/**
 * hooks for reloading all data
 * NOTE: useRefresh hooks should be imported and used only once, to avoid multiple usage of useInterval
 */

const POLL_DATA_INTERVAL = 5 * 60 * 1000; // 5m
const MAX_HISTORY_COUNT = 100;
const PER_DAY = 'day' as HistoryInterval;

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

    await appDispatch(getPools('30d'));

    isLoading.current = false;
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
    getGlobalHistory();
  });

  useInterval(() => {
    refreshPage();
  }, POLL_DATA_INTERVAL);
};
