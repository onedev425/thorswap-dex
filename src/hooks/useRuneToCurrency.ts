import { AssetValue, SwapKitNumber } from '@swapkit/core';
import { RUNEAsset } from 'helpers/assets';
import { usePools } from 'hooks/usePools';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback } from 'react';
import { useApp } from 'store/app/hooks';

export const useRuneToCurrency = (abbreviate: boolean = true) => {
  const { baseCurrency } = useApp();
  const { pools } = usePools();

  const formatter = useCallback(
    (value: number) =>
      abbreviate
        ? value >= 1_000
          ? new SwapKitNumber(value).toAbbreviation(2)
          : new SwapKitNumber(value).toSignificant(6)
        : value,
    [abbreviate],
  );
  const { data } = useTokenPrices([RUNEAsset]);
  const runePrice = data[RUNEAsset.toString()]?.price_usd || 0;

  const runeToCurrency = useCallback(
    (runeAmount: string) => {
      const isUSD = baseCurrency.includes('THOR.USD');
      const quoteAsset = isUSD
        ? new AssetValue({ value: 1, identifier: baseCurrency, decimal: 8 })
        : AssetValue.fromStringSync(baseCurrency);

      if (!quoteAsset) return `$0.00`;

      const runeAmountNumber = parseFloat(runeAmount);
      const pool =
        pools.find((pool) => pool.asset.toString() === quoteAsset.toString()) || pools[0];

      if (!pool || runeAmountNumber === 0) return `$0.00`;
      if (baseCurrency.includes('RUNE')) return `ᚱ ${formatter(runeAmountNumber)}`;

      const runeValue = runeAmountNumber * runePrice;

      if (isUSD) return `$${formatter(runeValue)}`;

      const assetValue = runeValue / parseFloat(pool.assetPriceUSD);

      return `${quoteAsset.ticker} ${formatter(assetValue)}`;
    },
    [baseCurrency, formatter, pools, runePrice],
  );

  return runeToCurrency;
};

export const useRuneAtTimeToCurrency = (abbreviate: boolean = true) => {
  const { baseCurrency } = useApp();
  const { pools } = usePools();

  const formatter = useCallback(
    (value: number) => (abbreviate ? new SwapKitNumber(value).toAbbreviation() : value),
    [abbreviate],
  );

  const runeToCurrencyAtTime = useCallback(
    (runeAmountString: string, runePriceStr?: string) => {
      const runeAmount = new SwapKitNumber({
        value: parseInt(runeAmountString) / 10 ** 8,
        decimal: 8,
      });
      const runePrice = runeAmount.mul(runePriceStr || '0').getValue('number') || 0;
      const isUSD = baseCurrency.includes('THOR.USD');
      const quoteAsset = isUSD
        ? new AssetValue({ value: 1, identifier: baseCurrency, decimal: 8 })
        : AssetValue.fromStringSync(baseCurrency);

      if (!quoteAsset) return `$0.00`;

      const pool =
        pools.find((pool) => pool.asset.toString() === quoteAsset.toString()) || pools[0];
      const runeAmountNumber = runeAmount?.getValue('number') || 0;

      if (!pool || runeAmountNumber === 0) return `$0.00`;
      if (baseCurrency.includes('RUNE')) return `ᚱ ${formatter(runeAmountNumber)}`;

      const runeValue = runeAmountNumber * runePrice;

      if (isUSD) return `$${formatter(runeValue)}`;

      const assetValue = runeValue / parseFloat(pool.assetPriceUSD);

      return `${quoteAsset.ticker} ${formatter(assetValue)}`;
    },
    [baseCurrency, formatter, pools],
  );

  return runeToCurrencyAtTime;
};
