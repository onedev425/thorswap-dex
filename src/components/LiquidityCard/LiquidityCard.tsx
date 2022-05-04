import { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Amount, Asset, Liquidity } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import moment from 'moment'

import { ChainPoolData } from 'views/ManageLiquidity/types'

import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import {
  useCollapse,
  Box,
  Typography,
  Icon,
  Button,
  Tooltip,
} from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'

import { PoolShareType } from 'store/midgard/types'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { getAddLiquidityRoute, getWithdrawRoute } from 'settings/constants'

import { LiquidityInfo } from './LiquidityInfo'

type LiquidityCardProps = ChainPoolData & {
  withFooter?: boolean
}

const RuneAsset = Asset.RUNE()

export const LiquidityCard = ({
  dateLastAdded,
  pool,
  shareType,
  withFooter,
  liquidityUnits,
  runeAdded,
  assetAdded,
  runeWithdrawn,
  assetWithdrawn,
  runePending,
  assetPending,
}: LiquidityCardProps) => {
  const navigate = useNavigate()
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()
  const { isMdActive } = useWindowSize()

  const liquidityObj = useMemo(
    () => new Liquidity(pool, Amount.fromMidgard(liquidityUnits)),
    [liquidityUnits, pool],
  )
  const { poolShare } = liquidityObj
  const runeShare = useMemo(() => {
    if (shareType === PoolShareType.RUNE_ASYM) {
      return liquidityObj.getAsymRuneShare()
    }
    return liquidityObj.runeShare
  }, [shareType, liquidityObj])
  const assetShare = useMemo(() => {
    if (shareType === PoolShareType.ASSET_ASYM) {
      return liquidityObj.getAsymAssetShare()
    }
    return liquidityObj.assetShare
  }, [shareType, liquidityObj])

  const isPendingLP = useMemo(
    () => !!(Number(runePending) > 0 || Number(assetPending)),
    [runePending, assetPending],
  )

  const tickerPending =
    (isPendingLP &&
      (Number(runePending) > 0 ? pool.asset.ticker : Asset.RUNE().ticker)) ||
    ''

  const lpType = useMemo(() => {
    switch (shareType) {
      case PoolShareType.SYM:
        return `RUNE + ${pool.asset.ticker} LP`
      case PoolShareType.ASSET_ASYM:
        return `${pool.asset.ticker} LP`
      case PoolShareType.RUNE_ASYM:
        return 'RUNE LP'
    }
  }, [pool.asset.ticker, shareType])

  return (
    <Box className="self-stretch" justifyCenter col>
      <HighlightCard
        className="!rounded-2xl p-2 !gap-1"
        type={isPendingLP ? 'warn' : 'primary'}
      >
        <Box
          onClick={toggle}
          className="cursor-pointer"
          alignCenter
          justify="between"
        >
          <Box center>
            {isPendingLP && (
              <Tooltip content={t('pendingLiquidity.pendingLiquidity')}>
                <Icon className="mr-3" name="warn" size={24} color="yellow" />
              </Tooltip>
            )}

            <Box col>
              <AssetLpIcon
                inline
                asset1={pool.asset}
                asset2={RuneAsset}
                size={isActive && isMdActive ? 40 : 32}
              />
            </Box>

            <Typography
              className={classNames(
                'mx-1 md:mx-3 !transition-all',
                isActive ? 'text-body md:!text-subtitle1' : '!text-body',
              )}
              fontWeight="semibold"
            >
              {lpType}
            </Typography>
          </Box>

          <Box className="gap-2" center>
            <Box col align="end">
              <Typography
                className={classNames(
                  '!transition-all',
                  isActive ? '!text-body' : '!text-caption',
                )}
                fontWeight="normal"
              >
                {` ${t('views.liquidity.poolShare')}`}
              </Typography>

              <Typography
                className={classNames(
                  '!transition-all',
                  isActive ? '!text-subtitle1' : '!text-body',
                )}
                fontWeight="bold"
              >
                {poolShare.toFixed(4) === '0 %' ? '~0 %' : poolShare.toFixed(4)}
              </Typography>
            </Box>

            <Icon
              className={classNames('transform duration-300 ease', {
                '-rotate-180': isActive,
              })}
              name="chevronDown"
              color="secondary"
            />
          </Box>
        </Box>

        <LiquidityInfo
          lastAddedDate={moment
            .unix(Number(dateLastAdded))
            .format('YYYY-MM-DD')}
          poolShare={poolShare}
          assetShare={assetShare}
          runeShare={runeShare}
          asset={pool.asset}
          contentRef={contentRef}
          maxHeightStyle={maxHeightStyle}
          shareType={shareType}
          runeAdded={Amount.fromMidgard(runeAdded)}
          assetAdded={Amount.fromMidgard(assetAdded)}
          runeWithdrawn={Amount.fromMidgard(runeWithdrawn)}
          assetWithdrawn={Amount.fromMidgard(assetWithdrawn)}
          runePending={Amount.fromMidgard(runePending)}
          assetPending={Amount.fromMidgard(assetPending)}
          tickerPending={tickerPending}
        />

        {withFooter && (
          <Box className="space-x-6 md:pr-0" justifyCenter>
            <Button
              onClick={() => navigate(getAddLiquidityRoute(pool.asset))}
              className="px-8 md:px-12"
              variant="primary"
              stretch
            >
              {isPendingLP
                ? t('views.liquidity.completeButton')
                : t('views.liquidity.addButton')}
            </Button>

            <Button
              onClick={() => navigate(getWithdrawRoute(pool.asset))}
              className="px-8 md:px-12"
              variant="secondary"
              stretch
            >
              {t('common.withdraw')}
            </Button>
          </Box>
        )}
      </HighlightCard>
    </Box>
  )
}
