import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useEffect, useState } from 'react';
import { SORTED_EARN_ASSETS } from 'settings/chain';
import { getSaverData, getSaverPools } from 'store/midgard/actions';
import { useWallet } from 'store/wallet/hooks';
import { SaverPosition } from 'views/Earn/types';

export const useSaverPositions = () => {
  const { wallet, isWalletLoading } = useWallet();
  const [positions, setPositions] = useState<SaverPosition[]>([]);
  const [synthAvailability, setSynthAvailability] = useState<Record<Chain, boolean>>();

  const getSaverPosition = useCallback(
    async (asset: Asset) => {
      const address = wallet?.[asset.L1Chain]?.address || '';
      if (address) {
        const response = await getSaverData({ asset: asset.toString().toLowerCase(), address });
        const amount = Amount.fromMidgard(response.asset_deposit_value);

        return amount.gt(0) ? { asset, amount, provider: response } : null;
      }
    },
    [wallet],
  );

  const refreshPositions = useCallback(async () => {
    if (!isWalletLoading) {
      return;
    }

    const promises = SORTED_EARN_ASSETS.map(getSaverPosition);

    const pos = await Promise.all(promises);
    setPositions(pos.filter(Boolean) as SaverPosition[]);
  }, [getSaverPosition, isWalletLoading]);

  const getPosition = useCallback(
    (asset: Asset) => positions.find((item) => item.asset.eq(asset)),
    [positions],
  );

  const handlePoolsAvailability = useCallback(async () => {
    const response = await getSaverPools();
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
    positions,
    refreshPositions,
    synthAvailability,
  };
};
