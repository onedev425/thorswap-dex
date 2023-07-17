import { Amount } from '@thorswap-lib/swapkit-core';
import { showErrorToast } from 'components/Toast';
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
  const [expectedOutput, setExpectedOutput] = useState(Amount.fromAssetAmount(0, 8));
  const [expectedOutputMaxSlippage, setExpectedOutputMaxSlippage] = useState(
    Amount.fromAssetAmount(0, 8),
  );
  const [memo, setMemo] = useState('');
  const [previousErrorId, setPreviousErrorId] = useState('');

  const { currentData: data, error } = useGetBorrowQuery({
    assetIn,
    assetOut,
    amount,
    senderAddress,
    recipientAddress,
  });

  const errorId = assetIn + assetOut;

  useEffect(() => {
    if (error && amount && previousErrorId !== errorId) {
      setPreviousErrorId(assetIn + assetOut);
      showErrorToast(t('views.lending.repayError'));
      return;
    }
    setPreviousErrorId('');
  }, [error, amount, assetIn, assetOut, errorId, previousErrorId]);

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
  };
};
