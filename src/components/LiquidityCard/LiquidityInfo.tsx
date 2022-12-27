import { Amount, Asset, Percent } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Typography } from 'components/Atomic';
import { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { memo, RefObject, useMemo } from 'react';
import { t } from 'services/i18n';
import { PoolShareType } from 'store/midgard/types';

type Props = {
  assetShare: Amount;
  runeShare: Amount;
  poolShare: Percent;
  contentRef: RefObject<HTMLDivElement>;
  shareType: PoolShareType;
  asset: Asset;
  lastAddedDate: string;
  runeWithdrawn: Amount;
  assetWithdrawn: Amount;
  runePending: Amount;
  assetPending: Amount;
  maxHeightStyle: { maxHeight: string; overflow: string };
  tickerPending?: string;
};

const RuneAsset = Asset.RUNE();

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
          value: runeWithdrawn.toSignificantWithMaxDecimals(6),
        },
        {
          label: t('views.liquidity.assetWithdrawn'),
          value: assetWithdrawn.toSignificantWithMaxDecimals(6),
        },
      ];

      if (runePending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.runePending'),
          value: runePending.toSignificantWithMaxDecimals(6),
        });
      }

      if (assetPending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.assetPending'),
          value: assetPending.toSignificantWithMaxDecimals(6),
        });
      }

      if ([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${asset.ticker} ${t('views.liquidity.share')}`,
          value: (
            <Box center className="gap-2">
              <Typography>{`${assetShare.toSignificantWithMaxDecimals(6)} ${
                asset.ticker
              }`}</Typography>
              <AssetIcon asset={asset} size={24} />
            </Box>
          ),
        });
      }

      if ([PoolShareType.SYM, PoolShareType.RUNE_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${RuneAsset.symbol} ${t('views.liquidity.share')}`,
          value: (
            <Box center className="gap-2">
              <Typography>{`${runeShare.toFixed(4)} ${RuneAsset.symbol}`}</Typography>
              <AssetIcon asset={RuneAsset} size={24} />
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
          <Typography className="brightness-90" color="yellow" variant="caption">
            {t('pendingLiquidity.content', { asset: tickerPending })}
          </Typography>
        )}
        <Box col className="self-stretch pt-1 pb-2">
          <Box alignCenter row justify="between">
            <Typography className="px-1.5" color="cyan" variant="caption">
              {poolAssetsInfo}
            </Typography>
          </Box>

          <InfoTable horizontalInset items={summary} size="sm" />
        </Box>
      </Box>
    );
  },
);
