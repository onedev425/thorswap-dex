import { Amount, AmountType, AssetEntity as Asset, Percent } from '@thorswap-lib/swapkit-core';
import { BaseDecimal } from '@thorswap-lib/types';
import { useDebouncedValue } from 'hooks/useDebouncedValue';
import { useNetworkFee } from 'hooks/useNetworkFee';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSaverQuote } from 'store/midgard/actions';
import { useWallet } from 'store/wallet/hooks';
import { SaverQuoteResponse } from 'views/Earn/types';

type Props = {
  isDeposit: boolean;
  asset: Asset;
  withdrawPercent?: Percent;
  amount: Amount;
  apr?: number;
};

export const useEarnCalculations = ({ isDeposit, asset, withdrawPercent, amount, apr }: Props) => {
  const [saverQuote, setSaverQuoteData] = useState<SaverQuoteResponse>();
  const { wallet } = useWallet();

  const debouncedAmount = useDebouncedValue(amount);
  const debouncedWithdrawPercent = useDebouncedValue(withdrawPercent);
  const address = useMemo(() => wallet?.[asset.L1Chain]?.address || '', [wallet, asset.L1Chain]);

  const getConfirmData = useCallback(async () => {
    if (!debouncedAmount?.assetAmount) {
      return;
    }

    const quoteParams = isDeposit
      ? {
          type: 'deposit' as const,
          amount: `${Math.floor(debouncedAmount.assetAmount.toNumber() * 10 ** BaseDecimal.THOR)}`,
        }
      : {
          address,
          type: 'withdraw' as const,
          withdraw_bps: `${
            parseInt(debouncedWithdrawPercent?.toSignificantWithMaxDecimals() || '100') * 100
          }`,
        };

    const response = (await getSaverQuote({
      ...quoteParams,
      asset: asset.toString().toLowerCase(),
    })) as SaverQuoteResponse;

    setSaverQuoteData(response);
  }, [debouncedAmount.assetAmount, isDeposit, address, debouncedWithdrawPercent, asset]);

  useEffect(() => {
    getConfirmData();
  }, [getConfirmData]);

  const expectedOutputAmount = useMemo(
    () =>
      saverQuote?.expected_amount_out
        ? new Amount(saverQuote.expected_amount_out, AmountType.BASE_AMOUNT, BaseDecimal.THOR)
        : undefined,
    [saverQuote?.expected_amount_out],
  );

  const slippage = expectedOutputAmount?.mul(saverQuote?.slippage_bps || 0).div(10000);

  const { inboundFee: networkFee } = useNetworkFee({ inputAsset: asset });

  const daysToBreakEven = useMemo(() => {
    const daysAmount = slippage?.div(expectedOutputAmount?.mul(apr || 0).div(365) || 0);
    return Math.round(Number(daysAmount?.toFixedDecimal(2)));
  }, [apr, expectedOutputAmount, slippage]);

  return {
    slippage,
    getConfirmData,
    saverQuote,
    expectedOutputAmount,
    networkFee,
    daysToBreakEven,
  };
};
