import { Text } from "@chakra-ui/react";
import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box } from "components/Atomic";
import type { InfoRowConfig } from "components/InfoRow/types";
import { InfoTable } from "components/InfoTable";
import { RUNEAsset } from "helpers/assets";
import type { RefObject } from "react";
import { memo, useMemo } from "react";
import { t } from "services/i18n";
import { PoolShareType } from "store/midgard/types";

type Props = {
  assetShare: SwapKitNumber;
  runeShare: SwapKitNumber;
  poolShare: string;
  contentRef: RefObject<HTMLDivElement>;
  shareType: PoolShareType;
  asset: AssetValue;
  lastAddedDate: string;
  runePending: SwapKitNumber;
  assetPending: SwapKitNumber;
  maxHeightStyle: { maxHeight: string; overflow: string };
  tickerPending?: string;
};

export const LiquidityInfo = memo(
  ({
    asset,
    assetShare,
    contentRef,
    lastAddedDate,
    maxHeightStyle,
    poolShare,
    runeShare,
    shareType,
    runePending,
    assetPending,
    tickerPending,
  }: Props) => {
    const summary = useMemo(() => {
      const infoFields: InfoRowConfig[] = [
        { label: t("views.liquidity.poolShare"), value: poolShare === "0 %" ? "~0 %" : poolShare },
      ];

      if (runePending.gt(0)) {
        infoFields.push({
          label: t("views.liquidity.runePending"),
          value: runePending.toSignificant(6),
        });
      }

      if (assetPending.gt(0)) {
        infoFields.push({
          label: t("views.liquidity.assetPending"),
          value: assetPending.toSignificant(6),
        });
      }

      if ([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${asset.ticker} ${t("views.liquidity.share")}`,
          value: (
            <Box center className="gap-2">
              <Text>{`${assetShare.toSignificant(6)} ${asset.ticker}`}</Text>
              <AssetIcon asset={asset} size={24} />
            </Box>
          ),
        });
      }

      if ([PoolShareType.SYM, PoolShareType.RUNE_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${RUNEAsset.symbol} ${t("views.liquidity.share")}`,
          value: (
            <Box center className="gap-2">
              <Text>{`${runeShare.toSignificant(4)} ${RUNEAsset.symbol}`}</Text>
              <AssetIcon asset={RUNEAsset} size={24} />
            </Box>
          ),
        });
      }

      infoFields.push({
        label: t("views.liquidity.lastAdded"),
        value: lastAddedDate,
      });

      return infoFields;
    }, [
      asset,
      assetShare,
      lastAddedDate,
      poolShare,
      runeShare,
      shareType,
      runePending,
      assetPending,
    ]);

    const poolAssetsInfo = useMemo(() => {
      switch (shareType) {
        case PoolShareType.SYM:
          return `RUNE + ${asset.ticker} LP`;
        case PoolShareType.ASSET_ASYM:
          return `${asset.ticker} LP`;
        case PoolShareType.RUNE_ASYM:
          return "RUNE LP";
      }
    }, [asset.ticker, shareType]);

    return (
      <Box
        col
        className="overflow-hidden ease-in-out transition-all"
        ref={contentRef}
        style={maxHeightStyle}
      >
        {!!tickerPending && (
          <Text className="brightness-90" textStyle="caption" variant="yellow">
            {t("pendingLiquidity.content", { asset: tickerPending })}
          </Text>
        )}
        <Box col className="self-stretch pt-1 pb-2">
          <Box alignCenter row justify="between">
            <Text className="px-1.5" textStyle="caption" variant="cyan">
              {poolAssetsInfo}
            </Text>
          </Box>

          <InfoTable horizontalInset items={summary} size="sm" />
        </Box>
      </Box>
    );
  },
);
