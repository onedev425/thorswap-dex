import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useStreamTxToggle } from 'hooks/useStreamTxToggle';
import { useEffect, useMemo } from 'react';
import { useGetBorrowQuoteQuery } from 'store/thorswap/api';

interface UseBorrowProps {
  recipientAddress: string;
  senderAddress: string;
  assetIn: AssetValue;
  assetOut: AssetValue;
  amount: SwapKitNumber;
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
  const amountString = amount.toFixed(8);
  const debouncedAmount = useDebouncedValue(amountString);
  const debouncedSlippage = useDebouncedValue(slippage);

  const {
    currentData: data,
    error,
    isFetching,
  } = useGetBorrowQuoteQuery(
    {
      assetIn: assetIn.toString(),
      assetOut: assetOut.toString(),
      amount: debouncedAmount,
      slippage: debouncedSlippage.toString(),
      senderAddress,
      recipientAddress,
    },
    { skip: !debouncedAmount, refetchOnMountOrArgChange: true },
  );

  const { canStream, toggleStream, stream } = useStreamTxToggle(
    data?.streamingSwap?.memo || data?.calldata?.memo,
  );

  const borrowData = useMemo(() => {
    if (stream && data?.streamingSwap) {
      return data.streamingSwap;
    }

    return data;
  }, [data, stream]);

  const expectedOutput = useMemo(() => {
    return new SwapKitNumber({ value: borrowData?.expectedOutput || 0, decimal: assetOut.decimal });
  }, [assetOut.decimal, borrowData?.expectedOutput]);

  const expectedOutputAssetValue = useMemo(() => {
    return AssetValue.fromStringSync(assetOut.toString(), borrowData?.expectedOutput);
  }, [assetOut, borrowData?.expectedOutput]);

  const expectedOutputMaxSlippage = useMemo(() => {
    return new SwapKitNumber({
      value: borrowData?.expectedOutputMaxSlippage || 0,
      decimal: assetOut.decimal,
    });
  }, [assetOut.decimal, borrowData?.expectedOutputMaxSlippage]);

  const expectedDebt = useMemo(() => {
    return new SwapKitNumber({ value: borrowData?.expectedDebtIssued || 0, decimal: 8 });
  }, [borrowData?.expectedDebtIssued]);

  const slippageAmount = useMemo(() => {
    return expectedOutput.sub(expectedOutputMaxSlippage);
  }, [expectedOutput, expectedOutputMaxSlippage]);

  const slippageAmountUsd = useMemo(() => {
    return new SwapKitNumber({ value: borrowData?.expectedOutputUSD || 0, decimal: 8 }).sub(
      new SwapKitNumber({ value: borrowData?.expectedOutputMaxSlippageUSD || 0, decimal: 8 }),
    );
  }, [borrowData?.expectedOutputMaxSlippageUSD, borrowData?.expectedOutputUSD]);

  const collateralAmount = useMemo(() => {
    return new SwapKitNumber({
      value: borrowData?.expectedCollateralDeposited || 0,
      decimal: assetIn.decimal,
    });
  }, [assetIn.decimal, borrowData?.expectedCollateralDeposited]);

  const totalFeeUsd = useMemo(() => {
    const fees = borrowData?.fees.THOR;
    const outboundFees = fees?.find((fee) => fee.type === 'outbound');

    return new SwapKitNumber({ value: outboundFees?.totalFeeUSD || 0, decimal: 8 });
  }, [borrowData?.fees.THOR]);

  useEffect(() => {
    toggleStream(!!assetIn.toString() && !!data?.streamingSwap);
  }, [assetIn, data?.streamingSwap, toggleStream]);

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
    expectedOutputAssetValue,
  };
};
