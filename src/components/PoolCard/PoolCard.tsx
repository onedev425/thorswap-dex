import { useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { Box, Button, Card, Icon, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { ROUTES } from 'settings/constants'

import { PoolCardProps } from './types'

export const PoolCard = ({
  asset,
  iconName,
  color,
  price,
  change,
}: PoolCardProps) => {
  const navigate = useNavigate()

  const handleSwapNavigate = useCallback(() => {
    navigate(`${ROUTES.Swap}?input=${asset}`)
  }, [asset, navigate])

  const handleAddLiquidityNavigate = useCallback(() => {
    navigate(`${ROUTES.AddLiquidity}?input=${asset}`)
  }, [asset, navigate])

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
            {asset.ticker}
          </Typography>

          <Typography className="mb-2" color="secondary" fontWeight="semibold">
            {formatPrice(price)}
          </Typography>

          <Typography
            color={change >= 0 ? 'green' : 'red'}
            fontWeight="semibold"
          >
            {`${change >= 0 ? '+' : ''}${change}%`}
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
