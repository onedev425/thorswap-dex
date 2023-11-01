import type { AssetEntity as Asset } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { useStreamTxToggle } from 'hooks/useStreamTxToggle';
import { useEffect, useMemo, useState } from 'react';
import { useGetRepayValueQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

export const useRepay = ({
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

  const {
    data,
    isFetching: isLoading,
    error,
  } = useGetRepayValueQuery(
    {
      senderAddress,
      collateralAddress,
      amountPercentage: percentage.toFixed(),
      collateralAsset: collateralAsset.toString(),
      repayAsset: asset.toString(),
    },
    { skip: !percentage.toFixed() },
  );

  const { canStream, toggleStream, stream } = useStreamTxToggle(data?.streamingSwap?.memo);

  const repayData = useMemo(() => {
    if (stream && data?.streamingSwap) {
      return data.streamingSwap;
    }

    return data;
  }, [data, stream]);

  useEffect(() => {
    const getRepayAssetAmount = async () => {
      if (!repayData || error) {
        return setRepayAssetAmount(Amount.fromAssetAmount(0, 8));
      }

      const assetDecimals = await getEVMDecimal(asset);
      asset.setDecimal(assetDecimals);

      const repayAssetAmount = Amount.fromAssetAmount(
        repayData.repayAssetAmount,
        assetDecimals || asset.decimal,
      );

      setRepayAssetAmount(repayAssetAmount);
    };

    getRepayAssetAmount();
  }, [asset, repayData, error]);

  const repayOptimizeQuoteDetails = useMemo(
    () => ({
      estimatedTime: data?.estimatedTime,
      expectedOutput: data?.repayAssetAmount || '',
      expectedOutputUSD: data?.repayAssetAmount || '',
      streamingSwap: {
        estimatedTime: data?.streamingSwap?.estimatedTime,
        expectedOutput: data?.streamingSwap?.repayAssetAmount || '',
        expectedOutputUSD: data?.streamingSwap?.repayAssetAmountUSD || '',
      },
    }),
    [
      data?.estimatedTime,
      data?.repayAssetAmount,
      data?.streamingSwap?.estimatedTime,
      data?.streamingSwap?.repayAssetAmount,
      data?.streamingSwap?.repayAssetAmountUSD,
    ],
  );

  return {
    isLoading,
    repayAssetAmount,
    repayQuote: data,
    canStream,
    stream,
    toggleStream,
    repayOptimizeQuoteDetails,
  };
};
