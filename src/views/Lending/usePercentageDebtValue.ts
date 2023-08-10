import { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useMemo } from 'react';
import { useGetRepayValueQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

export const usePercentageDebtValue = ({
  asset,
  collateralAsset,
  percentage,
}: {
  asset: Asset;
  collateralAsset: Asset;
  totalAmount: Amount;
  percentage: Amount;
}) => {
  const { wallet } = useWallet();
  const debouncedPercentage = useDebouncedValue(percentage, 500);

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.L1Chain]?.address || '',
    [wallet, collateralAsset.L1Chain],
  );

  const senderAddress = useMemo(
    () => wallet?.[asset.L1Chain]?.address || '',
    [wallet, asset.L1Chain],
  );

  const { data, isLoading } = useGetRepayValueQuery(
    {
      senderAddress,
      collateralAddress,
      amountPercentage: debouncedPercentage.toFixed(),
      collateralAsset: `${collateralAsset.chain}.${collateralAsset.chain}`,
      assetIn: `${asset.chain}.${asset.chain}`,
    },
    { skip: !debouncedPercentage.toFixed() },
  );

  const repayAssetAmount = data
    ? Amount.fromAssetAmount(data.repayAssetAmount, 8)
    : Amount.fromAssetAmount(0, 8);

  return { isLoading, repayAssetAmount };
};
