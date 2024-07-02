import { Card, Collapse, Flex, Text } from "@chakra-ui/react";
import { type AssetValue, SwapKitNumber } from "@swapkit/sdk";
import { Icon, Tooltip } from "components/Atomic";
import type { RouteWithApproveType } from "components/SwapRouter/types";
import { formatDuration } from "components/TransactionTracker/helpers";
import { STREAMING_SWAPS_URL } from "config/constants";
import { useFormatPrice } from "helpers/formatPrice";
import { useMemo } from "react";
import { t } from "services/i18n";
import { navigateToExternalLink } from "settings/router";

type Props = {
  streamSwap: boolean;
  toggleStreamSwap: (enabled: boolean) => void;
  canStreamSwap: boolean;
  route: RouteWithApproveType | undefined;
  outputAsset: AssetValue | undefined;
};

export const SwapOptimizeSection = ({
  streamSwap,
  toggleStreamSwap,
  canStreamSwap,
  route,
  outputAsset,
}: Props) => {
  const estimatedTime = (route?.estimatedTime || 0) * 1000;
  const estimatedTimeStreamingSwap = (route?.streamingSwap?.estimatedTime || 0) * 1000;
  const timeDiff = estimatedTimeStreamingSwap - estimatedTime || 0;
  const priceUSDDiff = route?.streamingSwap?.expectedOutputUSD
    ? Number(route.streamingSwap.expectedOutputUSD) - Number(route.expectedOutputUSD)
    : 0;

  const outputAmount = useMemo(
    () =>
      new SwapKitNumber({
        value: route?.expectedOutput || "0",
        decimal: outputAsset?.decimal || 0,
      }),
    [outputAsset?.decimal, route?.expectedOutput],
  );

  const outputAmountStreamingSwap = useMemo(
    () =>
      new SwapKitNumber({
        value: route?.streamingSwap?.expectedOutput || "0",
        decimal: outputAsset?.decimal || 0,
      }),
    [outputAsset?.decimal, route?.streamingSwap?.expectedOutput],
  );

  const formatPrice = useFormatPrice();

  return (
    <Flex animateOpacity as={Collapse} in={canStreamSwap} w="100%">
      <Card gap={2} p={3} sx={{ w: "full", borderRadius: 16 }} variant="filledContainerTertiary">
        <Flex>
          <Text color="textSecondary" fontWeight="semibold" ml={2} textStyle="caption">
            {t("views.swap.priceOptimizationAvailable")}
          </Text>

          <Tooltip
            content={t("views.swap.priceOptimizationInfo")}
            onClick={() => navigateToExternalLink(STREAMING_SWAPS_URL)}
            place="bottom"
          >
            <Icon className="ml-1" color="secondary" name="infoCircle" size={18} />
          </Tooltip>
        </Flex>

        <Flex gap={1}>
          <Card
            borderColor={streamSwap ? "brand.btnPrimary" : undefined}
            flex={1}
            onClick={() => toggleStreamSwap(true)}
            px={2}
            py={1}
            sx={{ cursor: "pointer" }}
            variant="filledTertiary"
          >
            <Flex direction="column">
              <Flex align="center" gap={1} justify="space-between">
                <Text textStyle="caption-xs">{t("views.swap.priceOptimized")}</Text>
                <Icon color="yellow" name="coin" size={20} />
              </Flex>

              <Flex gap={1}>
                <Flex direction="column" mt={0.5}>
                  <Flex gap={1}>
                    <Text fontWeight="normal" textStyle="caption-xs">
                      {formatDuration(estimatedTimeStreamingSwap, { approx: true })}
                    </Text>
                  </Flex>

                  <Flex gap={1}>
                    <Text textStyle="caption-xs">
                      {outputAmountStreamingSwap.toSignificant(6)} {outputAsset?.ticker || ""}
                    </Text>
                    <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
                      (+{formatPrice(priceUSDDiff)})
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Card>

          <Card
            borderColor={streamSwap ? undefined : "brand.alpha.btnPrimary"}
            flex={1}
            onClick={() => toggleStreamSwap(false)}
            px={2}
            py={1}
            sx={{ cursor: "pointer" }}
            variant="filledTertiary"
          >
            <Flex direction="column">
              <Flex align="center" gap={1} justify="space-between">
                <Text textStyle="caption-xs">{t("views.swap.timeOptimized")}</Text>
                <Icon color="secondaryBtn" name="timer" size={22} />
              </Flex>

              <Flex gap={1}>
                <Flex direction="column" mt={0.5}>
                  <Flex gap={1}>
                    <Text fontWeight="normal" textStyle="caption-xs">
                      {formatDuration(estimatedTime, { approx: true })}
                    </Text>
                    <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
                      ({formatDuration(timeDiff, { approx: true })} faster)
                    </Text>
                  </Flex>

                  <Text textStyle="caption-xs">
                    {outputAmount.toSignificant(6)} {outputAsset?.ticker || ""}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Card>
    </Flex>
  );
};
