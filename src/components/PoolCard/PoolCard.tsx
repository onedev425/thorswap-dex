import { Button } from 'components/Button'
import { Card } from 'components/Card'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

import { t } from 'services/i18n'

import { PoolCardProps } from './types'

export const PoolCard = (props: PoolCardProps) => {
  const { coinSymbol, iconName, color, price, change } = props

  return (
    <Card size="lg" className="overflow-hidden">
      <div className="grid w-full grid-rows-2 auto-rows-min gap-y-3">
        <div className="grid grid-cols-3">
          <div className="col-span-1">
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
          </div>
          <div className="text-right col-span-2">
            <Icon name={iconName} color={color} size={120} />
            <Icon
              name={iconName}
              color={color}
              size={130}
              className="absolute -z-1 top-16 right-16 blur-md opacity-50"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-2 items-end">
          <Button type="outline" className="col-span-1">
            {t('common.swap')}
          </Button>
          <Button type="outline" className="col-span-2">
            {t('common.addLiquidity')}
          </Button>
        </div>
      </div>
      <div
        className={`absolute w-4/5 h-4/5 top-0 right-0 blur-3xl translate-x-1/2 -translate-y-1/2 bg-${color} opacity-30`}
      ></div>
    </Card>
  )
}
