import { Amount, Asset, Price, runeToAssetPrice } from '@thorswap-lib/multichain-core';
import { useCallback } from 'react';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

export const useRuneToCurrency = () => {
  const { baseCurrency } = useApp();
  const { pools } = useMidgard();

  const runeToCurrency = useCallback(
    (runeAmount: Amount): Price =>
      // @ts-expect-error TODO: will be fixed with new multichain-core
      runeToAssetPrice({ pools, runeAmount, quoteAsset: Asset.fromAssetString(baseCurrency) }),
    [baseCurrency, pools],
  );

  return runeToCurrency;
};
