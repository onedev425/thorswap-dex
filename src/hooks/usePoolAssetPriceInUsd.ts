import type { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Price } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

export const usePoolAssetPriceInUsd = ({ asset, amount }: { asset: Asset; amount: Amount }) => {
  const { getPoolsFromState } = useMidgard();
  const pools = getPoolsFromState();

  const poolAssetPriceInUSD = useMemo(
    () =>
      new Price({
        baseAsset: asset,
        pools,
        priceAmount: amount,
      }),
    [amount, asset, pools],
  );

  return poolAssetPriceInUSD;
};
