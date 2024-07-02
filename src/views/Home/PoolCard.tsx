import { Text } from "@chakra-ui/react";
import { AssetValue, Chain } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box, Button, Card } from "components/Atomic";
import { parseToPercent } from "helpers/parseHelpers";
import { useRuneToCurrency } from "hooks/useRuneToCurrency";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "services/i18n";
import { getAddLiquidityRoute, getSwapRoute } from "settings/router";
import type { ColorType } from "types/app";

type PoolCardProps = {
  color: ColorType;
  assetString: string;
  poolAPY: number;
  runeDepth: string;
};

export const PoolCard = ({ assetString, poolAPY, runeDepth, color }: PoolCardProps) => {
  const navigate = useNavigate();
  const runeToCurrency = useRuneToCurrency();

  const poolAsset = useMemo(
    () => AssetValue.fromStringSync(assetString) as AssetValue,
    [assetString],
  );

  const handleSwapNavigate = useCallback(() => {
    navigate(getSwapRoute(poolAsset));
  }, [navigate, poolAsset]);

  const handleAddLiquidityNavigate = useCallback(() => {
    navigate(getAddLiquidityRoute(poolAsset));
  }, [navigate, poolAsset]);

  return (
    <Card stretch className="flex-col min-w-fit max-w-[288px]">
      <Box className="px-6 pt-6" justify="between">
        <Box col>
          <Text className="mb-4" fontWeight="bold" textStyle="h2" textTransform="uppercase">
            {poolAsset.ticker}
          </Text>

          <Text className="mb-2" fontWeight="semibold" variant="secondary">
            {runeToCurrency(runeDepth)}
          </Text>

          <Text fontWeight="semibold" variant="green">
            {`${t("common.APR")}: ${parseToPercent(poolAPY)}`}
          </Text>
        </Box>

        <AssetIcon
          asset={poolAsset}
          hasChainIcon={[Chain.Avalanche, Chain.Ethereum, Chain.BinanceSmartChain].includes(
            poolAsset.chain,
          )}
          size={110}
        />
      </Box>

      <Box justifyCenter align="end" className="gap-x-2 mt-6">
        <Button stretch onClick={handleSwapNavigate} variant="outlineSecondary">
          {t("common.swap")}
        </Button>

        <Button stretch onClick={handleAddLiquidityNavigate} variant="outlineTertiary">
          {t("common.addLiquidity")}
        </Button>
      </Box>

      <div
        className={classNames(
          "-z-10 absolute rounded-full w-[90px] h-[90px] right-5 md:top-5 blur-xl opacity-50 dark:opacity-30",
          `bg-${color}`,
        )}
      />
    </Card>
  );
};
