import type { AssetValue } from '@swapkit/core';
import { SwapKitNumber } from '@swapkit/core';
import { useStreamTxToggle } from 'hooks/useStreamTxToggle';
import { useEffect, useMemo, useState } from 'react';
import { useGetRepayValueQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

export const useRepay = ({
  asset,
  collateralAsset,
  percentage,
}: {
  asset: AssetValue;
  collateralAsset: AssetValue;
  totalAmount: SwapKitNumber;
  percentage: SwapKitNumber;
  hasLoanMatured: boolean;
}) => {
  const { wallet } = useWallet();
  const [repayAssetAmount, setRepayAssetAmount] = useState(
    new SwapKitNumber({ value: 0, decimal: 8 }),
  );

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.chain]?.address || '',
    [wallet, collateralAsset.chain],
  );

  const senderAddress = useMemo(() => wallet?.[asset.chain]?.address || '', [wallet, asset.chain]);

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
        return setRepayAssetAmount(new SwapKitNumber({ value: 0, decimal: 8 }));
      }

      const repayAssetAmount = new SwapKitNumber({
        value: repayData.repayAssetAmount,
        decimal: asset.decimal,
      });

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
