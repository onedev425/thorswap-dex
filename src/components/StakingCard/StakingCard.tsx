import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon/AssetIcon'
import { Typography, Card, Icon, Button, Box } from 'components/Atomic'

import { t } from 'services/i18n'

import { Information } from '../Information'

type Props = {
  className?: string
}

export const StakingCard = ({ className }: Props) => {
  return (
    <Box col className={classNames('pb-12', className)}>
      <Box marginBottom={40}>
        <Typography variant="h2" fontWeight="extrabold" color="primary">
          {`$THOR ${t('common.staking')}`}
        </Typography>
      </Box>
      <Box>
        <Card className="shadow-2xl drop-shadow-4xl flex-col">
          <div className="flex justify-center absolute m-auto left-0 right-0 top-[-28px] ">
            <div
              style={{
                border: '8px solid #232e42',
                borderRadius: '50%',
                marginRight: '-24px',
              }}
            >
              <AssetIcon
                name="RUNE"
                bgColor="yellow"
                size={56}
                className="shadow-leftTicker"
              />
            </div>
            <div style={{ border: '8px solid #232e42', borderRadius: '50%' }}>
              <AssetIcon
                name="BTC"
                bgColor="purple"
                size={56}
                className="shadow-rightTicker"
              />
            </div>
          </div>
          <Box className="justify-between flex-row">
            <Box col className="p-4">
              <Typography
                variant="caption-xs"
                fontWeight="bold"
                color="secondary"
              >
                {t('common.exchange')}
              </Typography>
              <Typography variant="h4" color="primary" fontWeight="extrabold">
                {'THORSwap'}
              </Typography>
            </Box>
            <Box col className="p-4">
              <Typography
                variant="caption-xs"
                fontWeight="bold"
                color="secondary"
                className="text-right"
              >
                {t('common.APY')}
              </Typography>

              <Typography
                variant="h4"
                fontWeight="medium"
                color="greenLight"
                className="text-right"
              >
                {'130%'}
              </Typography>
            </Box>
          </Box>
          <Box className="px-4 max-w-[365px] justify-between flex-col">
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
            <Information
              label="Staking token"
              value="to be set"
              showBorder={false}
            />
          </Box>
          <div className="py-1 mt-4 w-full grid overflow-hidden grid-cols-3 grid-rows-1 gap-2 justify-items-center">
            <Button type="outline" variant="primary" className="col-start-1">
              {t('common.deposit')}
            </Button>
            <Button type="outline" variant="secondary" className="col-start-2">
              {t('common.withdraw')}
            </Button>
            <Button type="outline" variant="tertiary" className="col-start-3">
              {t('common.claim')}
            </Button>
          </div>
        </Card>
      </Box>
    </Box>
  )
}
