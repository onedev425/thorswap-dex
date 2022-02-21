import classNames from 'classnames'

import { t } from 'services/i18n'

import { Button } from '../Button'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { Information } from '../Information'
import { Typography } from '../Typography'

type Props = {
  className?: string
}

export const StakingCard = ({ className }: Props) => {
  return (
    <Card
      size="lg"
      className={classNames('flex-col max-w-[406px] pb-12', className)}
    >
      <Typography variant="h2" fontWeight="semibold" color="primary">
        {`$THOR ${t('common.staking')}`}
      </Typography>
      <div className="grid sm:grid-rows-2 sm:grid-cols-auto md:grid-cols-12 gap-y-1 md:gap-y-0 md:grid-rows-1 p-2 mt-12 mb-6">
        <div className="sm:col-span-12 md:col-span-2 text-center md:text-left">
          <Icon name="lightning" color="blueLight" size={40} />
        </div>
        <div className="grid grid-cols-2 gap-1 md:auto-rows-max sm:col-span-12 md:col-span-10">
          <Typography variant="body" fontWeight="bold" color="secondary">
            {t('common.exchange')}
          </Typography>
          <Typography
            variant="body"
            fontWeight="bold"
            color="secondary"
            className="text-right"
          >
            {t('common.APY')}
          </Typography>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {'THORSwap'}
          </Typography>
          <Typography
            variant="h4"
            fontWeight="light"
            color="primary"
            className="text-right"
          >
            {'130%'}
          </Typography>
        </div>
      </div>
      <Information
        label="Staking token"
        value={
          <div className="grid grid-cols-12 items-center pl-10">
            <div className="col-span-11">
              <Typography
                className="text-ellipsis overflow-hidden whitespace-nowrap"
                color="primary"
                fontWeight="bold"
                variant="caption-xs"
              >
                {'0x991A9B64805260c02702B3bCDF8c269dA98563aB'}
              </Typography>
            </div>
            <div className="col-span-1 ">
              <Icon
                className="relative top-0 "
                color="yellow"
                name="ethereum"
              />
            </div>
          </div>
        }
      />
      <Information label="Token Balance" value="12.656" />
      <Information label="Token Staked" value="1000" />
      <Information label="Claimable Rewards" value="20" />
      <Information label="Staking token" value="to be set" showBorder={false} />

      <div className="grid sm:grid-cols-1 gap-2 md:grid-cols-3 mt-7">
        <Button type="outline" className="col-span-1">
          {t('common.deposit')}
        </Button>
        <Button type="outline" variant="secondary" className="col-span-1">
          {t('common.withdraw')}
        </Button>
        <Button type="outline" variant="tertiary" className="col-span-1">
          {t('common.claim')}
        </Button>
      </div>
    </Card>
  )
}
