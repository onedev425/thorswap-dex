import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box } from "components/Atomic";
import { InfoTable } from "components/InfoTable";
import { RUNEAsset, unitToValue } from "helpers/assets";
import type { RefObject } from "react";
import { memo, useCallback, useMemo } from "react";
import { t } from "services/i18n";
import { PoolShareType } from "store/midgard/types";

type Props = {
  asset: AssetValue;
  assetPending: string;
  assetShare: string;
  assetWithdrawn: string;
  contentRef: RefObject<HTMLDivElement>;
  lastAddedDate: string;
  lpName: string;
  maxHeightStyle: { maxHeight: string; overflow: string };
  pendingTicker?: string;
  poolShare: string;
  runePending: string;
  runeShare: string;
  runeWithdrawn: string;
  shareType: PoolShareType;
};

export const LiquidityInfo = memo(
  ({
    asset,
    lpName,
    assetShare,
    contentRef,
    lastAddedDate,
    maxHeightStyle,
    poolShare,
    runeShare,
    shareType,
    runeWithdrawn,
    assetWithdrawn,
    runePending,
    assetPending,
    pendingTicker,
  }: Props) => {
    const toUnitValue = useCallback((unit: string) => unitToValue(unit, { toFixed: 6 }), []);

    const summary = useMemo(() => {
      const infoFields = [
        ...(runePending !== "0"
          ? [{ label: t("views.liquidity.runePending"), value: toUnitValue(runePending) }]
          : []),
        ...(assetPending !== "0"
          ? [{ label: t("views.liquidity.assetPending"), value: toUnitValue(assetPending) }]
          : []),
        ...([PoolShareType.SYM, PoolShareType.RUNE_ASYM].includes(shareType)
          ? [
              {
                label: `${RUNEAsset.symbol} ${t("views.liquidity.share")}`,
                value: (
                  <Box center className="gap-2">
                    <Text>{`${runeShare} ${RUNEAsset.symbol}`}</Text>
                    <AssetIcon asset={RUNEAsset} size={24} />
                  </Box>
                ),
              },
            ]
          : []),
        ...([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)
          ? [
              {
                label: `${asset.ticker} ${t("views.liquidity.share")}`,
                value: (
                  <Box center className="gap-2">
                    <Text>{`${assetShare} ${asset.ticker}`}</Text>
                    <AssetIcon asset={asset} size={24} />
                  </Box>
                ),
              },
            ]
          : []),
        { label: t("views.liquidity.poolShare"), value: poolShare },
        ...(runeWithdrawn !== "0"
          ? [{ label: t("views.liquidity.runeWithdrawn"), value: toUnitValue(runeWithdrawn) }]
          : []),
        ...(assetWithdrawn !== "0"
          ? [{ label: t("views.liquidity.assetWithdrawn"), value: toUnitValue(assetWithdrawn) }]
          : []),
        { label: t("views.liquidity.lastAdded"), value: lastAddedDate },
      ];

      return infoFields;
    }, [
      runePending,
      toUnitValue,
      assetPending,
      shareType,
      runeShare,
      asset,
      assetShare,
      poolShare,
      runeWithdrawn,
      assetWithdrawn,
      lastAddedDate,
    ]);

    return (
      <Box
        col
        className="overflow-hidden ease-in-out transition-all"
        ref={contentRef}
        style={maxHeightStyle}
      >
        {!!pendingTicker && (
          <Text className="brightness-90" textStyle="caption" variant="yellow">
            {t("pendingLiquidity.content", { asset: pendingTicker })}
          </Text>
        )}
        <Box col className="self-stretch pt-1 pb-2">
          <Box alignCenter row justify="between">
            <Text className="px-1.5" textStyle="caption" variant="cyan">
              {lpName}
            </Text>
          </Box>

          <InfoTable horizontalInset items={summary} size="sm" />
        </Box>
      </Box>
    );
  },
);
