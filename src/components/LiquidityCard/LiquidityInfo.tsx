import { memo, RefObject, useCallback, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Amount, Asset, Percent } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Icon, Typography } from 'components/Atomic'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoTable } from 'components/InfoTable'
import { ReloadButton } from 'components/ReloadButton'

import { useMidgard } from 'redux/midgard/hooks'
import { PoolShareType } from 'redux/midgard/types'

import { t } from 'services/i18n'

import {
  getAddLiquidityRoute,
  getPoolDetailRouteFromAsset,
  getWithdrawRoute,
  navigateToExternalLink,
} from 'settings/constants'

type Props = {
  assetShare: Amount
  runeShare: Amount
  poolShare: Percent
  withFooter?: boolean
  contentRef: RefObject<HTMLDivElement>
  shareType: PoolShareType
  asset: Asset
  lastAddedDate: string
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
    withFooter,
  }: Props) => {
    const { loadMemberDetailsByChain, chainMemberDetailsLoading } = useMidgard()
    const navigate = useNavigate()

    const reloadChainPoolDetails = useCallback(() => {
      // @ts-expect-error mistyped in Asset
      loadMemberDetailsByChain(asset.chain)
    }, [asset.chain, loadMemberDetailsByChain])

    const navigateToPoolDetail = useCallback(() => {
      navigateToExternalLink(getPoolDetailRouteFromAsset(asset))
    }, [asset])

    const summary = useMemo(() => {
      const infoFields: InfoRowConfig[] = [
        { label: t('views.liquidity.poolShare'), value: poolShare.toFixed(4) },
        {
          label: t('views.liquidity.lastAdded'),
          value: lastAddedDate,
        },
      ]

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

      return infoFields
    }, [asset, assetShare, lastAddedDate, poolShare, runeShare, shareType])

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
        <Box col className="pt-5 self-stretch">
          <Box alignCenter row justify="between">
            <Typography className="px-1.5" color="cyan" variant="caption">
              {poolAssetsInfo}
            </Typography>

            <Box className="gap-x-2">
              <Button
                className="px-2.5"
                type="borderless"
                variant="tint"
                tooltip={t('views.liquidity.checkPoolDetail')}
                onClick={navigateToPoolDetail}
                startIcon={<Icon size={16} name="chart" />}
              />

              <ReloadButton
                size={16}
                loading={chainMemberDetailsLoading[asset.chain]}
                onLoad={reloadChainPoolDetails}
              />
            </Box>
          </Box>

          <InfoTable items={summary} horizontalInset />
        </Box>

        {withFooter && (
          <Box className="space-x-6 md:pr-0 pt-5 md:pt-10" justifyCenter>
            <Button
              onClick={() => navigate(getAddLiquidityRoute(asset))}
              className="px-8 md:px-12"
              variant="primary"
              size="lg"
              stretch
            >
              {t('views.liquidity.addButton')}
            </Button>

            <Button
              onClick={() => navigate(getWithdrawRoute(asset))}
              className="px-8 md:px-12"
              variant="secondary"
              size="lg"
              stretch
            >
              {t('common.withdraw')}
            </Button>
          </Box>
        )}
      </Box>
    )
  },
)
