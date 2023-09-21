import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { useEffect, useMemo, useState } from 'react';
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
  hasLoanMatured: boolean;
}) => {
  const { wallet } = useWallet();
  const [repayAssetAmount, setRepayAssetAmount] = useState(Amount.fromAssetAmount(0, 8));

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
      repayAsset: `${asset.chain}.${asset.chain}`,
    },
    { skip: !percentage.toFixed() },
  );

  useEffect(() => {
    const getRepatAssetAmount = async () => {
      if (!data) {
        return Amount.fromAssetAmount(0, 8);
      }

      const assetDecimals = await getEVMDecimal(asset);
      const repayAssetAmount = Amount.fromAssetAmount(
        data.repayAssetAmount,
        assetDecimals || asset.decimal,
      );

      setRepayAssetAmount(repayAssetAmount);
    };

    getRepatAssetAmount();
  }, [asset, data]);

  return { isLoading, repayAssetAmount, repayQuote: data };
};
