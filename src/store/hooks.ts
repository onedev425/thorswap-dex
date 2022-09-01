import { PoolPeriods } from '@thorswap-lib/midgard-sdk';
import { Amount, Asset, Price, runeToAssetPrice } from '@thorswap-lib/multichain-sdk';
import { useCallback, useRef } from 'react';
import { IS_DEV_API, IS_STAGENET } from 'settings/config';
import { useMidgard } from 'store/midgard/hooks';
import { useAppDispatch } from 'store/store';

import { useApp } from './app/hooks';

/**
 * hooks for managing global state per page, loading etc
 */
const periods: PoolPeriods[] = ['180d', '100d', '90d', '30d', '7d', '24h', '1h'];

export const useGlobalState = () => {
  const isLoading = useRef(false);
  const dispatch = useAppDispatch();

  const { baseCurrency } = useApp();
  const { actions, pools } = useMidgard();

  const loadInitialData = useCallback(async () => {
    if (isLoading.current) return;
    isLoading.current = true;
    dispatch(actions.getVolume24h());
    dispatch(actions.getStats());
    dispatch(actions.getNetworkData());
    dispatch(actions.getLastblock());
    dispatch(actions.getMimir());
    dispatch(actions.getQueue());
    if (IS_DEV_API || IS_STAGENET) {
      await dispatch(actions.getPools(periods[0]));

      isLoading.current = false;
      for (const period of periods.slice(1)) {
        await dispatch(actions.getPools(period));
      }
    } else {
      dispatch(actions.getPools());
    }
  }, [dispatch, actions]);

  const refreshPage = useCallback(
    (route = undefined) => {
      if (!route) {
        loadInitialData();
      } else {
        dispatch(actions.getMimir());
        dispatch(actions.getStats());
      }
    },
    [loadInitialData, dispatch, actions],
  );

  const runeToCurrency = useCallback(
    (runeAmount: Amount): Price =>
      runeToAssetPrice({
        pools,
        runeAmount,
        quoteAsset: Asset.fromAssetString(baseCurrency),
      }),
    [baseCurrency, pools],
  );

  return {
    loadInitialData,
    refreshPage,
    runeToCurrency,
  };
};
