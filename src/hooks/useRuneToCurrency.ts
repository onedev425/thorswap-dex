import { Amount, AssetEntity, Pool, Price } from '@thorswap-lib/swapkit-core';
import { poolByAsset, RUNEAsset } from 'helpers/assets';
import { useCallback } from 'react';
import { useApp } from 'store/app/hooks';
import { useMidgard } from 'store/midgard/hooks';

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

export const useRunePrice = (pool?: Pool) => {
  if (!pool) return 0;
  return formatAssetToNumber(pool.runePriceInAsset.mul(pool.assetUSDPrice));
};

export const useRuneToCurrency = (abbreviate: boolean = true) => {
  const { baseCurrency } = useApp();
  const { pools } = useMidgard();

  const formatter = useCallback((value: number) => (abbreviate ? toAbbreviate(value) : value), []);
  const runePrice = useRunePrice(pools[0]);

  const runeToCurrency = useCallback(
    (runeAmount: Amount) => {
      const isUSD = baseCurrency.includes('USD');
      const quoteAsset = AssetEntity.fromAssetString(baseCurrency);

      if (!quoteAsset) return `$0.00`;

      const pool = poolByAsset(quoteAsset, pools) || pools[0];
      const runeAmountNumber = formatAssetToNumber(runeAmount);

      if (!pool || runeAmountNumber === 0) return `$0.00`;
      if (baseCurrency.includes('RUNE')) return `ᚱ ${formatter(runeAmountNumber)}`;

      const runeValue = runeAmountNumber * runePrice;

      if (isUSD) return `$${formatter(runeValue)}`;

      const assetUSDPrice = formatAssetToNumber(pool.assetUSDPrice);
      const assetValue = runeValue / assetUSDPrice;

      return `${quoteAsset.ticker} ${formatter(assetValue)}`;
    },
    [baseCurrency, formatter, pools, runePrice],
  );

  return runeToCurrency;
};
