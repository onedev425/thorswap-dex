import { Amount } from '@thorswap-lib/swapkit-core';
import { showErrorToast } from 'components/Toast';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { useGetBorrowQuery } from 'store/thorswap/api';

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
  const [expectedOutput, setExpectedOutput] = useState(Amount.fromAssetAmount(0, 8));
  const [expectedOutputMaxSlippage, setExpectedOutputMaxSlippage] = useState(
    Amount.fromAssetAmount(0, 8),
  );
  const [memo, setMemo] = useState('');

  const { currentData: data, error } = useGetBorrowQuery(
    {
      assetIn,
      assetOut,
      amount: debouncedAmount,
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

  useEffect(() => {
    setExpectedOutput(Amount.fromAssetAmount(data?.expectedOutput || 0, 8));
  }, [setExpectedOutput, data?.expectedOutput]);

  useEffect(() => {
    setExpectedOutputMaxSlippage(Amount.fromAssetAmount(data?.expectedOutputMaxSlippage || 0, 8));
  }, [setExpectedOutput, data?.expectedOutputMaxSlippage]);

  useEffect(() => {
    setMemo(data?.memo || '');
  }, [setMemo, data?.memo]);

  return {
    memo,
    expectedOutput,
    expectedOutputMaxSlippage,
    hasError: !!error,
  };
};
