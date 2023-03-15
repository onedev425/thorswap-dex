import { Text } from '@chakra-ui/react';
import { AssetAmount } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
import { formatPrice } from 'helpers/formatPrice';
import { memo, useMemo } from 'react';
import { GetTokenPriceResponseOject } from 'store/thorswap/types';
import { GeckoData } from 'store/wallet/types';

type Props = {
  info: AssetAmount;
  geckoData: Record<string, GeckoData>;
  tokenListData?: GetTokenPriceResponseOject;
};

export const ChainInfo = memo(
  ({ geckoData, info: { asset, assetAmount }, tokenListData }: Props) => {
    const { currentPrice, priceChangePercentage24h } = useMemo(() => {
      if (!tokenListData) {
        const { current_price, price_change_percentage_24h } = geckoData[asset.symbol] || {};

        return {
          currentPrice: current_price,
          priceChangePercentage24h: price_change_percentage_24h,
        };
      }

      return {
        currentPrice: tokenListData.price_usd,
        priceChangePercentage24h: tokenListData.cg?.price_change_percentage_24h_usd
          ? tokenListData.cg?.price_change_percentage_24h_usd
          : 0.0,
      };
    }, [tokenListData, geckoData, asset.symbol]);

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
            <Text>{asset.name}</Text>
            <Text fontWeight="semibold" textStyle="caption" variant="secondary">
              {value}
            </Text>
          </Box>
        </Box>

        <Box col align="end">
          <Text>{formatPrice(currentPrice)}</Text>
          <Text
            fontWeight="semibold"
            textStyle="caption"
            variant={priceChangePercentage24h >= 0 ? 'green' : 'red'}
          >
            {priceChangePercentage24h?.toFixed(2)}%
          </Text>
        </Box>
      </Box>
    );
  },
);
