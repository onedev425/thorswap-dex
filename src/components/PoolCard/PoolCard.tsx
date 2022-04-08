import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { Amount, Percent, Pool } from '@thorswap-lib/multichain-sdk'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Card, Typography } from 'components/Atomic'

import { useGlobalState } from 'store/hooks'

import { t } from 'services/i18n'

import { getAddLiquidityRoute, getSwapRoute } from 'settings/constants'

import { ColorType } from 'types/app'

type PoolCardProps = {
  pool: Pool
  color: ColorType
}

export const PoolCard = ({ pool, color }: PoolCardProps) => {
  const navigate = useNavigate()
  const { runeToCurrency } = useGlobalState()

  const handleSwapNavigate = useCallback(() => {
    navigate(getSwapRoute(pool.asset))
  }, [navigate, pool.asset])

  const handleAddLiquidityNavigate = useCallback(() => {
    navigate(getAddLiquidityRoute(pool.asset))
  }, [navigate, pool.asset])

  return (
    <Card className="flex-col overflow-clip min-w-fit max-w-[288px]" stretch>
      <Box justify="between" className="px-6 pt-6">
        <Box col>
          <Typography
            className="mb-4"
            variant="h2"
            fontWeight="bold"
            transform="uppercase"
          >
            {pool.asset.ticker}
          </Typography>

          <Typography className="mb-2" color="secondary" fontWeight="semibold">
            {runeToCurrency(
              Amount.fromMidgard(pool.detail.runeDepth).mul(2),
            ).toCurrencyFormat(2)}
          </Typography>

          <Typography color="green" fontWeight="semibold">
            APY: {`${new Percent(pool.detail.poolAPY).toFixed(0)}`}
          </Typography>
        </Box>

        <AssetIcon asset={pool.asset} size={110} />
      </Box>

      <Box className="gap-x-2" mt={5} align="end" justifyCenter>
        <Button type="outline" onClick={handleSwapNavigate} stretch>
          {t('common.swap')}
        </Button>

        <Button
          stretch
          variant="tertiary"
          type="outline"
          onClick={handleAddLiquidityNavigate}
        >
          {t('common.addLiquidity')}
        </Button>
      </Box>

      <div
        className={`absolute w-4/5 h-4/5 top-0 right-0 blur-3xl translate-x-1/2 -translate-y-1/2 bg-${color} opacity-30`}
      />
    </Card>
  )
}
