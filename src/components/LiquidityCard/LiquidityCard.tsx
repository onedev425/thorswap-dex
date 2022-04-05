import { useMemo } from 'react'

import { Amount, Asset, Liquidity } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import moment from 'moment'

import { ChainPoolData } from 'views/ManageLiquidity/types'

import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import { useCollapse, Card, Box, Typography, Icon } from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

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
}: LiquidityCardProps) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()
  const { isMdActive } = useWindowSize()

  const { poolShare, assetShare, runeShare } = useMemo(
    () => new Liquidity(pool, Amount.fromMidgard(liquidityUnits)),
    [liquidityUnits, pool],
  )

  return (
    <Box justifyCenter col>
      <Card
        stretch
        className={classNames(
          'flex-col bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl',
          borderHoverHighlightClass,
        )}
      >
        <Box
          onClick={toggle}
          className="cursor-pointer mx-4 my-4 md:mx-2"
          alignCenter
          justify="between"
        >
          <Box center>
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
              {pool.asset.ticker}
              {' / '}
              {RuneAsset.symbol}
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
                {poolShare.toFixed(4)}
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
          withFooter={withFooter}
          shareType={shareType}
        />
      </Card>
    </Box>
  )
}
