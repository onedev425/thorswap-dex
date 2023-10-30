import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useCallback, useMemo, useState } from 'react';
import { useGetBorrowQuoteQuery } from 'store/thorswap/api';

interface UseBorrowProps {
  recipientAddress: string;
  senderAddress: string;
  assetIn: AssetEntity;
  assetOut: AssetEntity;
  amount: number;
  slippage: number;
}

export const useBorrow = ({
  recipientAddress,
  senderAddress,
  assetIn,
  assetOut,
  amount,
  slippage,
}: UseBorrowProps) => {
  const debouncedAmount = useDebouncedValue(amount);
  const debouncedSlippage = useDebouncedValue(slippage);
  const [stream, setStream] = useState(false);

  const {
    currentData: data,
    error,
    isFetching,
  } = useGetBorrowQuoteQuery(
    {
      assetIn: assetIn.toString(),
      assetOut: assetOut.toString(),
      amount: parseFloat(debouncedAmount.toString()).toFixed(8),
      slippage: debouncedSlippage.toString(),
      senderAddress,
      recipientAddress,
    },
    { skip: !debouncedAmount, refetchOnMountOrArgChange: true },
  );

  const borrowData = useMemo(() => {
    if (stream && data?.streamingSwap) {
      return data.streamingSwap;
    }

    return data;
  }, [data, stream]);

  const expectedOutput = useMemo(() => {
    return Amount.fromAssetAmount(borrowData?.expectedOutput || 0, assetOut.decimal);
  }, [assetOut.decimal, borrowData?.expectedOutput]);

  const expectedOutputMaxSlippage = useMemo(() => {
    return Amount.fromAssetAmount(borrowData?.expectedOutputMaxSlippage || 0, assetOut.decimal);
  }, [assetOut.decimal, borrowData?.expectedOutputMaxSlippage]);

  const expectedDebt = useMemo(() => {
    return Amount.fromAssetAmount(borrowData?.expectedDebtIssued || 0, 8);
  }, [borrowData?.expectedDebtIssued]);

  const slippageAmount = useMemo(() => {
    return expectedOutput.sub(expectedOutputMaxSlippage);
  }, [expectedOutput, expectedOutputMaxSlippage]);

  const slippageAmountUsd = useMemo(() => {
    return Amount.fromAssetAmount(borrowData?.expectedOutputUSD || 0, 8).sub(
      Amount.fromAssetAmount(borrowData?.expectedOutputMaxSlippageUSD || 0, 8),
    );
  }, [borrowData?.expectedOutputMaxSlippageUSD, borrowData?.expectedOutputUSD]);

  const collateralAmount = useMemo(() => {
    return Amount.fromAssetAmount(borrowData?.expectedCollateralDeposited || 0, assetIn.decimal);
  }, [assetIn.decimal, borrowData?.expectedCollateralDeposited]);

  const totalFeeUsd = useMemo(() => {
    const fees = borrowData?.fees.THOR;
    const outboundFees = fees?.find((fee) => fee.type === 'outbound');

    return Amount.fromAssetAmount(outboundFees?.totalFeeUSD || 0, 8);
  }, [borrowData?.fees.THOR]);

  const canStream = useMemo(
    () => !!data?.calldata.memoStreamingSwap,
    [data?.calldata?.memoStreamingSwap],
  );

  const toggleStream = useCallback(
    (enabled: boolean) => setStream(enabled && !!canStream),
    [canStream],
  );

  return {
    collateralAmount,
    expectedDebt,
    expectedOutput,
    expectedOutputMaxSlippage,
    hasError: !!error,
    borrowQuote: data,
    slippageAmount,
    slippageAmountUsd,
    totalFeeUsd,
    isFetching,
    toggleStream,
    stream,
    canStream,
  };
};
