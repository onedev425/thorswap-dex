import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SORTED_EARN_ASSETS } from 'settings/chain';
import { getSaverData, getSaverPools } from 'store/midgard/actions';
import { ThornodePoolType } from 'store/midgard/types';
import { useWallet } from 'store/wallet/hooks';
import { SaverPosition } from 'views/Earn/types';
import { getSaverPoolNameForAsset } from 'views/Earn/utils';

export const useSaverPositions = () => {
  const { wallet, isWalletLoading } = useWallet();
  const [positions, setPositions] = useState<SaverPosition[]>([]);
  const [synthAvailability, setSynthAvailability] = useState<Record<Chain, boolean>>();
  const [thornodePools, setThornodePools] = useState<ThornodePoolType[]>([]);

  const saverPositions = useMemo(() => {
    if (thornodePools.length) {
      return positions.map((p) => {
        const saverPool = thornodePools.find(
          (pool) => pool.asset === getSaverPoolNameForAsset(p.asset),
        );

        if (saverPool) {
          const saverDepth = Amount.fromMidgard(saverPool.savers_depth);
          const saverUnits = Amount.fromMidgard(saverPool.savers_units);
          const saverRatio = p.units.div(saverUnits);
          const amount = saverRatio.mul(saverDepth);

          return { ...p, saverPool, amount };
        }

        return p;
      });
    }

    return positions;
  }, [positions, thornodePools]);

  const getSaverPosition = useCallback(
    async (asset: Asset) => {
      const address = wallet?.[asset.L1Chain]?.address || '';
      if (address) {
        const response = await getSaverData({ asset: asset.toString().toLowerCase(), address });
        const units = Amount.fromMidgard(response.units);

        return units.gt(0) ? { asset, units, provider: response } : null;
      }
    },
    [wallet],
  );

  const refreshPositions = useCallback(async () => {
    if (isWalletLoading) {
      return;
    }

    const promises = SORTED_EARN_ASSETS.map(getSaverPosition);

    const pos = await Promise.all(promises);
    setPositions(pos.filter(Boolean) as SaverPosition[]);
  }, [getSaverPosition, isWalletLoading]);

  const getPosition = useCallback(
    (asset: Asset) => saverPositions.find((item) => item.asset.eq(asset)),
    [saverPositions],
  );

  const handlePoolsAvailability = useCallback(async () => {
    const response = await getSaverPools();
    setThornodePools(response);

    const availability = response.reduce((acc, pool) => {
      if (!pool.asset.includes('-')) {
        const [chain] = pool.asset.split('.');
        acc[chain as Chain] = pool.synth_mint_paused;
      }
      return acc;
    }, {} as Record<Chain, boolean>);
    setSynthAvailability(availability);
  }, []);

  useEffect(() => {
    handlePoolsAvailability();
  }, [handlePoolsAvailability]);

  return {
    getPosition,
    getSaverPosition,
    positions: saverPositions,
    refreshPositions,
    synthAvailability,
  };
};
