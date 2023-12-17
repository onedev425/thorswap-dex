import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { useWallet } from 'context/wallet/hooks';
import { usePools } from 'hooks/usePools';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSaverData, getSaverPools } from 'store/midgard/actions';
import type { ThornodePoolType } from 'store/midgard/types';
import type { SaverPosition } from 'views/Earn/types';

export const useSaverPositions = () => {
  const { getWalletAddress, isWalletLoading } = useWallet();
  const [positions, setPositions] = useState<SaverPosition[]>([]);
  const { pools } = usePools();

  const [synthAvailability, setSynthAvailability] = useState<Record<string, boolean>>();
  const [thornodePools, setThornodePools] = useState<ThornodePoolType[]>([]);

  const saverPositions = useMemo(() => {
    if (!thornodePools.length) return positions;

    return positions.map((p) => {
      const saverPool = thornodePools.find(
        ({ asset }) => asset === p.asset.toString().toUpperCase(),
      );

      if (!saverPool) return p;

      const saverDepth = SwapKitNumber.fromBigInt(BigInt(saverPool.savers_depth), 8);
      const saverUnits = SwapKitNumber.fromBigInt(BigInt(saverPool.savers_units), 8);

      // position amount = (saverUnits / totalSaverUnits) * saverDepth
      const amount = p.units.div(saverUnits).mul(saverDepth);

      return {
        ...p,
        saverPool,
        amount,
        earnedAmount:
          p.depositAmount && amount.gt(p.depositAmount) ? amount.sub(p.depositAmount) : null,
      };
    });
  }, [positions, thornodePools]);

  const getSaverPosition = useCallback(
    async (asset: AssetValue) => {
      const address = getWalletAddress(asset.chain);
      if (address) {
        const response = await getSaverData({ asset: asset.toString(), address });
        const units = SwapKitNumber.fromBigInt(BigInt(response.units), 8);
        const depositAmount = SwapKitNumber.fromBigInt(BigInt(response.asset_deposit_value), 8);

        // amount will be filled be updated with correct value when pools are loaded
        return units.gt(0)
          ? { asset, units, provider: response, amount: units, depositAmount }
          : null;
      }
    },
    [getWalletAddress],
  );

  const refreshPositions = useCallback(async () => {
    if (isWalletLoading) return;

    const saversAssets =
      pools
        ?.filter((pool) => pool.saversDepth !== '0')
        .map((pool) => AssetValue.fromStringSync(pool.asset)!) || [];

    const promises = saversAssets.map(getSaverPosition);

    const pos = await Promise.all(promises);
    setPositions(pos.filter(Boolean) as SaverPosition[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalletLoading, pools]);

  const getPosition = useCallback(
    (asset: AssetValue) => saverPositions.find((item) => item.asset.eq(asset)),
    [saverPositions],
  );

  const handlePoolsAvailability = useCallback(async () => {
    const response = await getSaverPools();

    setThornodePools(response);

    const availability = response.reduce(
      (acc, pool) => {
        acc[pool.asset] = pool.synth_mint_paused;
        return acc;
      },
      {} as Record<string, boolean>,
    );

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
