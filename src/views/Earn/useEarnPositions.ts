import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { useCallback, useState } from 'react';
import { SORTED_BASE_ASSETS } from 'settings/chain';
import { getSaverData } from 'store/midgard/actions';
import { useWallet } from 'store/wallet/hooks';
import { SaverPosition } from 'views/Earn/types';

export const useSaverPositions = () => {
  const { wallet } = useWallet();
  const [positions, setPositions] = useState<SaverPosition[]>([]);

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
    const promises = SORTED_BASE_ASSETS.map(getSaverPosition);

    const pos = await Promise.all(promises);
    setPositions(pos.filter(Boolean) as SaverPosition[]);
  }, [getSaverPosition]);

  const getPosition = useCallback(
    (asset: Asset) => positions.find((item) => item.asset.eq(asset)),
    [positions],
  );

  return {
    positions,
    getSaverPosition,
    refreshPositions,
    getPosition,
  };
};
