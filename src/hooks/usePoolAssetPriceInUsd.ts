import { Amount, AssetEntity as Asset, Price } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

export const usePoolAssetPriceInUsd = ({ asset, amount }: { asset: Asset; amount: Amount }) => {
  const { pools } = useMidgard();

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
