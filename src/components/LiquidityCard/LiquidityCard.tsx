import { useMemo } from 'react'

import { Amount, Asset, Liquidity } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import moment from 'moment'

import { ChainPoolData } from 'views/ManageLiquidity/types'

import { AssetIcon } from 'components/AssetIcon'
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon'
import {
  Button,
  useCollapse,
  Card,
  Box,
  Typography,
  Icon,
  Link,
} from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'
import { InfoRowConfig } from 'components/InfoRow/types'
import { InfoTable } from 'components/InfoTable'

import { PoolShareType } from 'redux/midgard/types'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

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

  const summary = useMemo(() => {
    const infoFields: InfoRowConfig[] = [
      { label: t('views.liquidity.poolShare'), value: poolShare.toFixed(4) },
      {
        label: t('views.liquidity.lastAdded'),
        value: moment.unix(Number(dateLastAdded)).format('YYYY-MM-DD'),
      },
    ]

    if ([PoolShareType.SYM, PoolShareType.ASSET_ASYM].includes(shareType)) {
      infoFields.unshift({
        label: pool.asset.ticker,
        value: (
          <Box className="gap-2" center>
            <Typography>
              {`${assetShare.toFixed(4)} ${pool.asset.ticker}`}
            </Typography>
            <AssetIcon size={27} asset={pool.asset} />
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
  }, [assetShare, dateLastAdded, pool.asset, poolShare, runeShare, shareType])

  const poolAssetsInfo = useMemo(() => {
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
    <Box justifyCenter col>
      <Card
        className={classNames(
          'flex flex-col bg-light-gray-light dark:!bg-dark-gray-light !rounded-2xl cursor-pointer',
          borderHoverHighlightClass,
        )}
        onClick={toggle}
      >
        <Box className="mx-4 my-4 md:mx-2" alignCenter justify="between">
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
            <Box className="gap-1" center>
              <Typography variant="subtitle1" fontWeight="bold">
                {Amount.fromMidgard(liquidityUnits).toFixed(2)}
              </Typography>

              <Typography variant="caption" fontWeight="normal">
                &nbsp;LP tokens
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

        <div
          className="flex flex-col overflow-hidden duration-300 ease-in-out transition-max-height"
          ref={contentRef}
          style={maxHeightStyle}
        >
          <Box col className="pt-5 self-stretch">
            <Typography className="px-2" color="cyan" variant="caption">
              {poolAssetsInfo}
            </Typography>

            <InfoTable items={summary} horizontalInset />
          </Box>

          {withFooter && (
            <Box className="space-x-6 md:pr-0 pt-5 md:pt-10" justifyCenter>
              <Link
                className="w-full"
                to={`${ROUTES.AddLiquidity}?input=${pool.asset}`}
              >
                <Button
                  className="px-8 md:px-12"
                  variant="primary"
                  size="lg"
                  stretch
                >
                  {t('views.liquidity.addButton')}
                </Button>
              </Link>
              <Link className="w-full" to={ROUTES.WithdrawLiquidity}>
                <Button
                  className="px-8 md:px-12"
                  variant="secondary"
                  size="lg"
                  stretch
                >
                  {t('common.withdraw')}
                </Button>
              </Link>
            </Box>
          )}
        </div>
      </Card>
    </Box>
  )
}
