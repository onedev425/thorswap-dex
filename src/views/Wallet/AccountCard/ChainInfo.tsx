import { AssetAmount } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { formatPrice } from 'helpers/formatPrice';
import { memo } from 'react';
import { GeckoData } from 'store/wallet/types';

type Props = {
  info: AssetAmount;
  geckoData: Record<string, GeckoData>;
};

export const ChainInfo = memo(({ geckoData, info: { asset, assetAmount } }: Props) => {
  const {
    current_price: currentPrice = 0.0,
    price_change_percentage_24h: priceChangePercentage24h = 0.0,
  } = geckoData[asset.symbol] || {};

  const assetBalance = formatPrice(assetAmount.toNumber() * currentPrice);
  const value = `${formatPrice(assetAmount.toNumber(), {
    prefix: '',
  })} (${assetBalance})`;

  return (
    <Box
      className="px-3 py-2 border-0 border-b border-solid border-light-gray-light dark:border-dark-border-primary"
      justify="between"
    >
      <Box>
        <AssetIcon asset={asset} hasChainIcon={false} />
        <Box col className="pl-2">
          <Typography>{asset.name}</Typography>
          <Typography color="secondary" fontWeight="semibold" variant="caption">
            {value}
          </Typography>
        </Box>
      </Box>

      <Box col align="end">
        <Typography>{formatPrice(currentPrice)}</Typography>
        <Typography
          color={priceChangePercentage24h >= 0 ? 'green' : 'red'}
          fontWeight="semibold"
          variant="caption"
        >
          {priceChangePercentage24h?.toFixed(2)}%
        </Typography>
      </Box>
    </Box>
  );
});
