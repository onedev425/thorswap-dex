import { Flex, Text } from "@chakra-ui/react";
import type { SwapKitNumber } from "@swapkit/sdk";
import { Icon, Tooltip } from "components/Atomic";
import { t } from "services/i18n";
import { HIGH_LENDING_SLIPPAGE } from "views/Lending/constants";

type Props = {
  depth: number | string;
  totalFeeUsd?: SwapKitNumber;
  slippagePercent: number;
};

export const VirtualDepthSlippageInfo = ({ depth, totalFeeUsd, slippagePercent }: Props) => {
  const slippageState = getSlippageState(Number(depth), slippagePercent);

  return (
    <Tooltip content={slippageState.tooltip}>
      <Flex alignItems="center" gap={2}>
        <Text color={slippageState.color} textStyle="caption">
          {totalFeeUsd?.toCurrency() || "0"}
        </Text>

        <Icon color="secondary" name="infoCircle" size={20} />
      </Flex>
    </Tooltip>
  );
};

function getSlippageState(depth: number, slippagePercent: number) {
  if (!depth) {
    return { color: "", tooltip: "" };
  }

  if (depth > 85 && slippagePercent < HIGH_LENDING_SLIPPAGE) {
    return { color: "brand.green", tooltip: t("views.lending.slippage.low") };
  }

  if (depth > 70 && slippagePercent < HIGH_LENDING_SLIPPAGE) {
    return { color: "brand.yellow", tooltip: t("views.lending.slippage.medium") };
  }

  return { color: "brand.red", tooltip: t("views.lending.slippage.high") };
}
