import { Amount, AssetEntity as Asset, Price } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useMidgard } from 'store/midgard/hooks';

export const usePercentageDebtValue = ({
  asset,
  percentage,
  totalAmount,
}: {
  asset: Asset;
  totalAmount: Amount;
  percentage: Amount;
}) => {
  const { pools } = useMidgard();
  const usdValue = totalAmount.mul(percentage).div(100);

  const assetPrice = useMemo(
    () =>
      new Price({
        baseAsset: asset,
        pools,
      }),
    [asset, pools],
  );

  const assetAmount = usdValue.div(assetPrice.unitPrice);

  return assetAmount;
};
