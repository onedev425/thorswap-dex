import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { useCallback, useState } from 'react';
import { SORTED_BASE_ASSETS } from 'settings/chain';
import { getSaverData } from 'store/midgard/actions';
import { useWallet } from 'store/wallet/hooks';
import { SaverPosition } from 'views/Savings/types';

export function useSaverPositions() {
  const { wallet } = useWallet();
  const [positions, setPositions] = useState<SaverPosition[]>([]);

  const getSaverPosition = useCallback(
    async (asset: Asset) => {
      const address = wallet?.[asset.L1Chain]?.address || '';
      if (address) {
        const response = await getSaverData({ asset: asset.toString().toLowerCase(), address });
        const position: SaverPosition = {
          asset,
          amount: Amount.fromMidgard(response.asset_deposit_value),
          provider: response,
        };

        return position.amount.gt(0) ? position : null;
      }
    },
    [wallet],
  );

  const refreshPositions = useCallback(async () => {
    const promises = SORTED_BASE_ASSETS.map((asset) => {
      return getSaverPosition(asset);
    });

    const pos = await Promise.all(promises);
    setPositions(pos.filter(Boolean) as SaverPosition[]);
  }, [getSaverPosition]);

  const getPosition = useCallback(
    (asset: Asset) => {
      return positions.find((item) => item.asset.eq(asset));
    },
    [positions],
  );

  return {
    positions,
    getSaverPosition,
    refreshPositions,
    getPosition,
  };
}
