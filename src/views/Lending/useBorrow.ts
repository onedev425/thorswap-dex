import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useEffect, useMemo, useState } from 'react';
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
  const [memo, setMemo] = useState('');

  const { currentData: data, error } = useGetBorrowQuoteQuery(
    {
      assetIn: assetIn.toString(),
      assetOut: assetOut.toString(),
      amount: debouncedAmount.toString(),
      slippage: debouncedSlippage.toString(),
      senderAddress,
      recipientAddress,
    },
    { skip: !debouncedAmount, refetchOnMountOrArgChange: true },
  );

  const expectedOutput = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedOutput || 0, assetOut.decimal);
  }, [assetOut.decimal, data?.expectedOutput]);

  const expectedOutputMaxSlippage = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedOutputMaxSlippage || 0, assetOut.decimal);
  }, [assetOut.decimal, data?.expectedOutputMaxSlippage]);

  const expectedDebt = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedDebtIssued || 0, 8);
  }, [data?.expectedDebtIssued]);

  const slippageAmount = useMemo(() => {
    return expectedOutput.sub(expectedOutputMaxSlippage);
  }, [expectedOutput, expectedOutputMaxSlippage]);

  const slippageAmountUsd = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedOutputUSD || 0, 8).sub(
      Amount.fromAssetAmount(data?.expectedOutputMaxSlippageUSD || 0, 8),
    );
  }, [data?.expectedOutputMaxSlippageUSD, data?.expectedOutputUSD]);

  const collateralAmount = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedCollateralDeposited || 0, assetIn.decimal);
  }, [assetIn.decimal, data?.expectedCollateralDeposited]);

  useEffect(() => {
    setMemo(data?.memo || '');
  }, [setMemo, data?.memo]);

  return {
    collateralAmount,
    memo,
    expectedDebt,
    expectedOutput,
    expectedOutputMaxSlippage,
    hasError: !!error,
    borrowQuote: data,
    slippageAmount,
    slippageAmountUsd,
  };
};
