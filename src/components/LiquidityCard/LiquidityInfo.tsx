import { memo, RefObject, useMemo } from 'react'

import { Amount, Asset, Percent } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoTable } from 'components/InfoTable'

import { PoolShareType } from 'redux/midgard/types'

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
  runePending: Amount
  assetPending: Amount
  maxHeightStyle: { maxHeight: string; overflow: string }
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
    runePending,
    assetPending,
  }: Props) => {
    const summary = useMemo(() => {
      const infoFields: InfoRowConfig[] = [
        { label: t('views.liquidity.poolShare'), value: poolShare.toFixed(4) },
        {
          label: t('views.liquidity.runeAdded'),
          value: runeAdded.toFixed(2),
        },
        {
          label: t('views.liquidity.assetAdded'),
          value: assetAdded.toFixed(2),
        },
      ]

      if (runePending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.runePending'),
          value: runePending.toFixed(2),
        })
      }

      if (assetPending.gt(0)) {
        infoFields.push({
          label: t('views.liquidity.assetPending'),
          value: assetPending.toFixed(2),
        })
      }

      if ([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: asset.ticker,
          value: (
            <Box className="gap-2" center>
              <Typography>
                {`${assetShare.toFixed(4)} ${asset.ticker}`}
              </Typography>
              <AssetIcon size={27} asset={asset} />
            </Box>
          ),
        })
      }

      if ([PoolShareType.SYM, PoolShareType.RUNE_ASYM].includes(shareType)) {
        infoFields.unshift({
          label: RuneAsset.symbol,
          value: (
            <Box className="gap-2" center>
              <Typography>
                {`${runeShare.toFixed(4)} ${RuneAsset.symbol}`}
              </Typography>
              <AssetIcon size={27} asset={RuneAsset} />
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
        <Box col className="pt-5 self-stretch pb-2 md:pb-6">
          <Box alignCenter row justify="between">
            <Typography className="px-1.5" color="cyan" variant="caption">
              {poolAssetsInfo}
            </Typography>
          </Box>

          <InfoTable items={summary} horizontalInset />
        </Box>
      </Box>
    )
  },
)
