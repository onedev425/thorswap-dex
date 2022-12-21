import { Amount, Asset, Price } from '@thorswap-lib/multichain-core';
import { runeToAssetPrice } from 'helpers/formatPrice';
import { useCallback } from 'react';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

export const useRuneToCurrency = () => {
  const { baseCurrency } = useApp();
  const { pools } = useMidgard();

  const runeToCurrency = useCallback(
    (runeAmount: Amount): Price =>
      runeToAssetPrice({ pools, runeAmount, quoteAsset: Asset.fromAssetString(baseCurrency) }),
    [baseCurrency, pools],
  );

  return runeToCurrency;
};
