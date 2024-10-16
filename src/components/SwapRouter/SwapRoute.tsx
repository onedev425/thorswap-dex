import { Text } from "@chakra-ui/react";
import { type AssetValue, SwapKitNumber } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box } from "components/Atomic";
import { HighlightCard } from "components/HighlightCard";
import { HoverIcon } from "components/HoverIcon";
import { GasPriceIndicator } from "components/SwapRouter/GasPriceIndicator";
import { RouteTimeEstimate } from "components/SwapRouter/RouteTimeEstimate";
import type { RouteWithApproveType } from "components/SwapRouter/types";
import { useFormatPrice } from "helpers/formatPrice";
import { tokenLogoURL } from "helpers/logoURL";
import { memo, useMemo } from "react";
import { t } from "services/i18n";

import { ProviderLogos } from "./ProviderLogos";

type Props = RouteWithApproveType & {
  selected?: boolean;
  onClick: () => void;
  outputAsset: AssetValue;
  unitPrice: number;
  streamSwap?: boolean;
};

export const SwapRoute = memo(
  ({
    expectedOutput,
    streamingSwap,
    onClick,
    isApproved,
    outputAsset,
    unitPrice,
    path,
    providers,
    selected,
    fees,
    streamSwap,
    timeEstimates,
  }: Props) => {
    const formatPrice = useFormatPrice();
    const [, address] = outputAsset.symbol.split("-");

    const outputValue = useMemo(
      () => Number.parseFloat((streamSwap && streamingSwap?.expectedOutput) || expectedOutput),
      [expectedOutput, streamSwap, streamingSwap?.expectedOutput],
    );

    const routeOutput = useMemo(
      () => new SwapKitNumber({ value: outputValue, decimal: outputAsset.decimal }),
      [outputValue, outputAsset.decimal],
    );

    const logoURI = tokenLogoURL({
      address,
      identifier: `${outputAsset.chain}.${outputAsset.ticker}`,
    });

    const shortPath = useMemo(() => {
      const pathParts = path.split(" -> ")?.map((part) => part.split("-")?.[0]);
      return `${pathParts[0]} → ${pathParts[pathParts.length - 1]}`;
    }, [path]);

    const expectedOutputPrice = useMemo(
      () => formatPrice(unitPrice * outputValue),
      [outputValue, formatPrice, unitPrice],
    );

    return (
      <HighlightCard className="!px-3 !py-1.5 !gap-0" isFocused={selected} onClick={onClick}>
        <Box justify="between">
          <Box alignCenter className="py-2">
            <ProviderLogos providers={providers.toReversed()} />
            {isApproved && (
              <HoverIcon
                iconName="approved"
                size={18}
                tooltip={t("views.swap.routeContractApproved")}
              />
            )}
          </Box>

          <Box align="end" justify="between">
            <Box center className="gap-x-1.5">
              <Box col>
                <Box className="gap-x-1" justify="end">
                  <Text fontWeight="bold">{routeOutput.toSignificant(6)}</Text>

                  <Text>{outputAsset.ticker}</Text>
                  <AssetIcon asset={outputAsset} hasChainIcon={false} logoURI={logoURI} size={18} />
                </Box>

                <Box alignCenter className="gap-x-1" justify="end">
                  <GasPriceIndicator fees={fees} size="sm" />

                  <Text className="text-right" variant="secondary">
                    {expectedOutputPrice}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="pl-1 pt-0.5" justify="between">
          <Text className="!text-[9px]" textStyle="caption-xs" variant="secondary">
            {shortPath}
          </Text>

          <RouteTimeEstimate
            streamSwap={typeof streamSwap === "boolean" ? streamSwap : !!streamingSwap}
            timeEstimates={timeEstimates}
          />
        </Box>
      </HighlightCard>
    );
  },
);
