import type { Pool } from '@thorswap-lib/swapkit-core';
import { Amount, AssetEntity, Price } from '@thorswap-lib/swapkit-core';
import { RUNEAsset, USDAsset } from 'helpers/assets';
import { usePools } from 'hooks/usePools';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback } from 'react';
import { useApp } from 'store/app/hooks';

export const runeToAssetPrice = ({
  runeAmount,
  quoteAsset,
  pools,
}: {
  runeAmount: Amount;
  quoteAsset?: AssetEntity | null;
  pools: Pool[];
}) =>
  new Price({
    baseAsset: RUNEAsset,
    quoteAsset: quoteAsset || RUNEAsset,
    pools,
    priceAmount: runeAmount,
  });

const toAbbreviate = (value: number, decimalPlaces = 2) => {
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Q', 'Q', 's'];
  let suffixNum = 0;
  let newValue = value;

  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  return `${newValue.toFixed(decimalPlaces)}${suffixNum > 0 ? ` ${suffixes[suffixNum]}` : ''}`;
};

const formatAssetToNumber = (amount: Amount) =>
  parseFloat(amount.toSignificant(8).replace(/,/gi, ''));

export const useRuneToCurrency = (abbreviate: boolean = true) => {
  const { baseCurrency } = useApp();
  const { pools } = usePools();

  const formatter = useCallback(
    (value: number) => (abbreviate ? toAbbreviate(value) : value),
    [abbreviate],
  );
  const { data } = useTokenPrices([RUNEAsset]);
  const runePrice = data[RUNEAsset.toString()]?.price_usd || 0;

  const runeToCurrency = useCallback(
    (runeAmount: Amount) => {
      const isUSD = baseCurrency.includes('USD');
      const quoteAsset = AssetEntity.fromAssetString(baseCurrency);

      if (!quoteAsset) return `$0.00`;

      const pool =
        pools.find((pool) => pool.asset.toString() === quoteAsset.toString()) || pools[0];
      const runeAmountNumber = formatAssetToNumber(runeAmount);

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
    (value: number) => (abbreviate ? toAbbreviate(value) : value),
    [abbreviate],
  );

  const runeToCurrencyAtTime = useCallback(
    (runeAmount: Amount, runePriceStr: string) => {
      const runePrice = formatAssetToNumber(Amount.fromAssetAmount(runePriceStr, USDAsset.decimal));

      const isUSD = baseCurrency.includes('USD');
      const quoteAsset = AssetEntity.fromAssetString(baseCurrency);

      if (!quoteAsset) return `$0.00`;

      const pool =
        pools.find((pool) => pool.asset.toString() === quoteAsset.toString()) || pools[0];
      const runeAmountNumber = formatAssetToNumber(runeAmount);

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
