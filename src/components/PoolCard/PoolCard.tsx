import { Box, Button, Card, Icon, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

import { PoolCardProps } from './types'

export const PoolCard = (props: PoolCardProps) => {
  const { coinSymbol, iconName, color, price, change } = props

  return (
    <Card
      stretch
      size="lg"
      className="flex-col overflow-hidden min-w-fit max-w-[320px]"
    >
      <Box justify="between">
        <Box col>
          <Typography
            transform="uppercase"
            fontWeight="bold"
            variant="h2"
            className="mb-4"
          >
            {coinSymbol}
          </Typography>

          <Typography className="mb-2" fontWeight="semibold">
            {price}
          </Typography>

          <Typography
            color={change >= 0 ? 'green' : 'red'}
            fontWeight="semibold"
          >
            {`${change}%`}
          </Typography>
        </Box>

        <Icon name={iconName} color={color} size={120} />
        <Icon
          name={iconName}
          color={color}
          size={130}
          className="absolute -z-10 top-12 right-12 blur-md opacity-50"
        />
      </Box>

      <Box mt={5} align="end" justify="between" className="gap-x-2">
        <Button type="outline">{t('common.swap')}</Button>

        <Button variant="tertiary" type="outline">
          {t('common.addLiquidity')}
        </Button>
      </Box>

      <div
        className={`absolute w-4/5 h-4/5 top-0 right-0 blur-3xl translate-x-1/2 -translate-y-1/2 bg-${color} opacity-30`}
      />
    </Card>
  )
}
