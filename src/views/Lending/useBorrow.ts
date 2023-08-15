import { Amount } from '@thorswap-lib/swapkit-core';
import { showErrorToast } from 'components/Toast';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useGetBorrowQuoteQuery } from 'store/thorswap/api';

interface UseBorrowProps {
  recipientAddress: string;
  senderAddress: string;
  assetIn: string;
  assetOut: string;
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
      assetIn,
      assetOut,
      amount: debouncedAmount.toString(),
      slippage: debouncedSlippage.toString(),
      senderAddress,
      recipientAddress,
    },
    { skip: !debouncedAmount },
  );

  useEffect(() => {
    if (error) {
      showErrorToast(t('views.lending.repayError'));
    }
  }, [error]);

  const expectedOutput = useMemo(() => {
    return Amount.fromNormalAmount(data?.expectedOutput || 0);
  }, [data?.expectedOutput]);

  const expectedOutputMaxSlippage = useMemo(() => {
    return Amount.fromNormalAmount(data?.expectedOutputMaxSlippage || 0);
  }, [data?.expectedOutputMaxSlippage]);

  const expectedDebt = useMemo(() => {
    return Amount.fromNormalAmount(data?.expectedDebtIssued || 0);
  }, [data?.expectedDebtIssued]);

  const slippageAmount = useMemo(() => {
    return expectedOutput.sub(expectedOutputMaxSlippage);
  }, [expectedOutput, expectedOutputMaxSlippage]);

  const collateralAmount = useMemo(() => {
    return Amount.fromNormalAmount(data?.expectedCollateralDeposited || 0);
  }, [data?.expectedCollateralDeposited]);

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
  };
};
