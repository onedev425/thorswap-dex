import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box } from "components/Atomic";
import { useFormatPrice } from "helpers/formatPrice";
import { memo, useMemo } from "react";
import type { GetTokenPriceResponseItem } from "store/thorswap/types";

type Props = {
  assetValue: AssetValue;
  priceData?: Record<string, GetTokenPriceResponseItem>;
};

export const ChainInfo = memo(({ assetValue, priceData }: Props) => {
  const formatPrice = useFormatPrice(2, "");

  const { currentPrice, priceChangePercentage24h } = useMemo(() => {
    const { price_usd, cg } = priceData?.[assetValue.toString()] || {};

    return {
      currentPrice: price_usd || 0.0,
      priceChangePercentage24h: cg?.price_change_percentage_24h_usd || 0.0,
    };
  }, [assetValue, priceData]);

  const assetNumberValue = assetValue.getValue("number");
  const value = `${assetValue.toSignificant(6)} (${formatPrice(assetNumberValue * currentPrice)})`;

  return (
    <Box
      className="px-3 py-2 border-0 border-b border-solid border-light-gray-light dark:border-dark-border-primary"
      justify="between"
    >
      <Box>
        <AssetIcon asset={assetValue} hasChainIcon={false} />
        <Box col className="pl-2">
          <Text>{assetValue.ticker}</Text>
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
          variant={priceChangePercentage24h >= 0 ? "green" : "red"}
        >
          {priceChangePercentage24h?.toFixed(2)}%
        </Text>
      </Box>
    </Box>
  );
});
