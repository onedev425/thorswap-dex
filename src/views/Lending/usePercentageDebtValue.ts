import { Amount, AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { useMemo } from 'react';
import { useGetRepayValueQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

export const usePercentageDebtValue = ({
  asset,
  collateralAsset,
  percentage,
  hasLoanMatured,
}: {
  asset: Asset;
  collateralAsset: Asset;
  totalAmount: Amount;
  percentage: Amount;
  hasLoanMatured: boolean;
}) => {
  const { wallet } = useWallet();

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.L1Chain]?.address || '',
    [wallet, collateralAsset.L1Chain],
  );

  const senderAddress = useMemo(
    () => wallet?.[asset.L1Chain]?.address || '',
    [wallet, asset.L1Chain],
  );

  const { data, isFetching: isLoading } = useGetRepayValueQuery(
    {
      senderAddress,
      collateralAddress,
      amountPercentage: percentage.toFixed(),
      collateralAsset: `${collateralAsset.chain}.${collateralAsset.chain}`,
      assetIn: `${asset.chain}.${asset.chain}`,
    },
    { skip: !percentage.toFixed() || !hasLoanMatured },
  );

  const repayAssetAmount = data
    ? Amount.fromAssetAmount(data.repayAssetAmount, 8)
    : Amount.fromAssetAmount(0, 8);

  return { isLoading, repayAssetAmount };
};
