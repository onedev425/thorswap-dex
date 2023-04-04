import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity, Percent } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { RUNEAsset } from 'helpers/assets';
import { memo, RefObject, useMemo } from 'react';
import { t } from 'services/i18n';
import { PoolShareType } from 'store/midgard/types';

type Props = {
  assetShare: Amount;
  runeShare: Amount;
  poolShare: Percent;
  contentRef: RefObject<HTMLDivElement>;
  shareType: PoolShareType;
  asset: AssetEntity;
  lastAddedDate: string;
  runeWithdrawn: Amount;
  assetWithdrawn: Amount;
  runePending: Amount;
  assetPending: Amount;
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
    runeWithdrawn,
    assetWithdrawn,
    runePending,
    assetPending,
    tickerPending,
  }: Props) => {
    const summary = useMemo(() => {
      const poolShareValue = poolShare.toFixed(4) === '0 %' ? '~0 %' : poolShare.toFixed(4);

      const infoFields: InfoRowConfig[] = [
        { label: t('views.liquidity.poolShare'), value: poolShareValue },
        {
          label: t('views.liquidity.runeWithdrawn'),
          value: runeWithdrawn.toSignificant(6),
        },
        {
          label: t('views.liquidity.assetWithdrawn'),
          value: assetWithdrawn.toSignificant(6),
        },
      ];

      if (runePending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.runePending'),
          value: runePending.toSignificant(6),
        });
      }

      if (assetPending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.assetPending'),
          value: assetPending.toSignificant(6),
        });
      }

      if ([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${asset.ticker} ${t('views.liquidity.share')}`,
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
          label: `${RUNEAsset.symbol} ${t('views.liquidity.share')}`,
          value: (
            <Box center className="gap-2">
              <Text>{`${runeShare.toFixed(4)} ${RUNEAsset.symbol}`}</Text>
              <AssetIcon asset={RUNEAsset} size={24} />
            </Box>
          ),
        });
      }

      infoFields.push({
        label: t('views.liquidity.lastAdded'),
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
      runeWithdrawn,
      assetWithdrawn,
    ]);

    const poolAssetsInfo = useMemo(() => {
      switch (shareType) {
        case PoolShareType.SYM:
          return `RUNE + ${asset.ticker} LP`;
        case PoolShareType.ASSET_ASYM:
          return `${asset.ticker} LP`;
        case PoolShareType.RUNE_ASYM:
          return 'RUNE LP';
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
            {t('pendingLiquidity.content', { asset: tickerPending })}
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
