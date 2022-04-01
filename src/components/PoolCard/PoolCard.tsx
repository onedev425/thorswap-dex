import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { Pool } from '@thorswap-lib/multichain-sdk'

import {
  Box,
  Button,
  Card,
  Icon,
  IconName,
  Typography,
} from 'components/Atomic'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { ROUTES } from 'settings/constants'

import { ColorType } from 'types/global'

type PoolCardProps = {
  pool: Pool
  iconName: IconName
  color: ColorType
  change: number
}

export const PoolCard = ({ change, pool, iconName, color }: PoolCardProps) => {
  const navigate = useNavigate()

  const handleSwapNavigate = useCallback(() => {
    navigate(`${ROUTES.Swap}?input=${pool.asset}`)
  }, [navigate, pool.asset])

  const handleAddLiquidityNavigate = useCallback(() => {
    navigate(`${ROUTES.AddLiquidity}?input=${pool.asset}`)
  }, [navigate, pool.asset])

  return (
    <Card className="flex-col overflow-hidden min-w-fit max-w-[288px] " stretch>
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
            {formatPrice(pool.assetUSDPrice)}
          </Typography>

          <Typography
            color={change >= 0 ? 'green' : 'red'}
            fontWeight="semibold"
          >
            {`${change >= 0 ? '+' : ''}${change.toFixed(2)}%`}
          </Typography>
        </Box>

        <Icon name={iconName} color={color} size={110} />
        <Icon
          className="absolute opacity-50 -z-10 top-9 right-8 blur-sm"
          name={iconName}
          color={color}
          size={120}
        />
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
