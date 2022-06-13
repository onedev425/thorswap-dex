import { memo, RefObject, useMemo } from 'react'

import { Amount, Asset, Percent } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoTable } from 'components/InfoTable'

import { PoolShareType } from 'store/midgard/types'

import { t } from 'services/i18n'

type Props = {
  assetShare: Amount
  runeShare: Amount
  poolShare: Percent
  withFooter?: boolean
  contentRef: RefObject<HTMLDivElement>
  shareType: PoolShareType
  asset: Asset
  lastAddedDate: string
  runeAdded: Amount
  assetAdded: Amount
  runeWithdrawn: Amount
  assetWithdrawn: Amount
  runePending: Amount
  assetPending: Amount
  maxHeightStyle: { maxHeight: string; overflow: string }
  tickerPending?: string
}

const RuneAsset = Asset.RUNE()

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
    runeAdded,
    assetAdded,
    runeWithdrawn,
    assetWithdrawn,
    runePending,
    assetPending,
    tickerPending,
  }: Props) => {
    const summary = useMemo(() => {
      const poolShareValue =
        poolShare.toFixed(4) === '0 %' ? '~0 %' : poolShare.toFixed(4)

      const infoFields: InfoRowConfig[] = [
        { label: t('views.liquidity.poolShare'), value: poolShareValue },
        {
          label: t('views.liquidity.runeAdded'),
          value: runeAdded.toSignificant(6),
        },
        {
          label: t('views.liquidity.assetAdded'),
          value: assetAdded.toSignificant(6),
        },
        {
          label: t('views.liquidity.runeWithdrawn'),
          value: runeWithdrawn.toSignificant(6),
        },
        {
          label: t('views.liquidity.assetWithdrawn'),
          value: assetWithdrawn.toSignificant(6),
        },
      ]

      if (runePending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.runePending'),
          value: runePending.toSignificant(6),
        })
      }

      if (assetPending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.assetPending'),
          value: assetPending.toSignificant(6),
        })
      }

      if ([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${asset.ticker} ${t('views.liquidity.share')}`,
          value: (
            <Box className="gap-2" center>
              <Typography>
                {`${assetShare.toSignificant(6)} ${asset.ticker}`}
              </Typography>
              <AssetIcon size={24} asset={asset} />
            </Box>
          ),
        })
      }

      if ([PoolShareType.SYM, PoolShareType.RUNE_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: `${RuneAsset.symbol} ${t('views.liquidity.share')}`,
          value: (
            <Box className="gap-2" center>
              <Typography>
                {`${runeShare.toFixed(4)} ${RuneAsset.symbol}`}
              </Typography>
              <AssetIcon size={24} asset={RuneAsset} />
            </Box>
          ),
        })
      }

      infoFields.push({
        label: t('views.liquidity.lastAdded'),
        value: lastAddedDate,
      })

      return infoFields
    }, [
      asset,
      assetShare,
      lastAddedDate,
      poolShare,
      runeShare,
      shareType,
      runeAdded,
      assetAdded,
      runePending,
      assetPending,
      runeWithdrawn,
      assetWithdrawn,
    ])

    const poolAssetsInfo = useMemo(() => {
      switch (shareType) {
        case PoolShareType.SYM:
          return `RUNE + ${asset.ticker} LP`
        case PoolShareType.ASSET_ASYM:
          return `${asset.ticker} LP`
        case PoolShareType.RUNE_ASYM:
          return 'RUNE LP'
      }
    }, [asset.ticker, shareType])

    return (
      <Box
        col
        className="overflow-hidden ease-in-out transition-all"
        ref={contentRef}
        style={maxHeightStyle}
      >
        {!!tickerPending && (
          <Typography
            className="brightness-90"
            color="yellow"
            variant="caption"
          >
            {t('pendingLiquidity.content', { asset: tickerPending })}
          </Typography>
        )}
        <Box col className="self-stretch pt-1 pb-2">
          <Box alignCenter row justify="between">
            <Typography className="px-1.5" color="cyan" variant="caption">
              {poolAssetsInfo}
            </Typography>
          </Box>

          <InfoTable items={summary} horizontalInset size="sm" />
        </Box>
      </Box>
    )
  },
)
