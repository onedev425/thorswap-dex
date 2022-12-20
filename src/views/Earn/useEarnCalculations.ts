import {
  Amount,
  AmountType,
  Asset,
  MULTICHAIN_DECIMAL,
  Percent,
} from '@thorswap-lib/multichain-core';
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
};

export const useEarnCalculations = ({ isDeposit, asset, withdrawPercent, amount }: Props) => {
  const [saverQuote, setSaverQuoteData] = useState<SaverQuoteResponse>();
  const { wallet } = useWallet();

  const debouncedAmount = useDebouncedValue(amount);
  const address = useMemo(() => wallet?.[asset.L1Chain]?.address || '', [wallet, asset.L1Chain]);

  const getConfirmData = useCallback(async () => {
    if (!debouncedAmount?.assetAmount) {
      return;
    }

    const quoteParams = isDeposit
      ? {
          type: 'deposit' as const,
          amount: `${Math.floor(
            debouncedAmount.assetAmount.toNumber() * 10 ** MULTICHAIN_DECIMAL,
          )}`,
        }
      : {
          address,
          type: 'withdraw' as const,
          withdraw_bps: `${parseInt(withdrawPercent?.toSignificant() || '100') * 100}`,
        };

    const response = (await getSaverQuote({
      ...quoteParams,
      asset: asset.toString().toLowerCase(),
    })) as SaverQuoteResponse;

    setSaverQuoteData(response);
  }, [address, debouncedAmount?.assetAmount, asset, isDeposit, withdrawPercent]);

  useEffect(() => {
    getConfirmData();
  }, [getConfirmData]);

  const expectedOutputAmount = useMemo(
    () =>
      saverQuote?.expected_amount_out
        ? new Amount(saverQuote.expected_amount_out, AmountType.BASE_AMOUNT, MULTICHAIN_DECIMAL)
        : undefined,
    [saverQuote?.expected_amount_out],
  );

  const slippage = expectedOutputAmount?.mul(saverQuote?.slippage_bps || 0).div(10000);

  const { inboundFee: networkFee } = useNetworkFee({ inputAsset: asset });

  return {
    slippage,
    getConfirmData,
    saverQuote,
    expectedOutputAmount,
    networkFee,
  };
};
