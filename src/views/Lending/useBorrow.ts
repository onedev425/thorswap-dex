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
}

export const useBorrow = ({
  recipientAddress,
  senderAddress,
  assetIn,
  assetOut,
  amount,
}: UseBorrowProps) => {
  const debouncedAmount = useDebouncedValue(amount);
  const [memo, setMemo] = useState('');

  const { currentData: data, error } = useGetBorrowQuoteQuery(
    {
      assetIn,
      assetOut,
      amount: debouncedAmount.toString(),
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
    return Amount.fromAssetAmount(data?.expectedOutputMaxSlippage || 0, 8);
  }, [data?.expectedOutputMaxSlippage]);

  const expectedOutputMaxSlippage = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedOutputMaxSlippage || 0, 8);
  }, [data?.expectedOutputMaxSlippage]);

  const expectedDebt = useMemo(() => {
    return Amount.fromAssetAmount(data?.expectedDebtIssued || 0, 8);
  }, [data?.expectedDebtIssued]);

  useEffect(() => {
    setMemo(data?.memo || '');
  }, [setMemo, data?.memo]);

  return {
    memo,
    expectedDebt,
    expectedOutput,
    expectedOutputMaxSlippage,
    hasError: !!error,
    borrowQuote: data,
  };
};
