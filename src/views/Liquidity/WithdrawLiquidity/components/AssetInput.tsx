import { memo } from 'react'

import classNames from 'classnames'

import { AssetAmountBox } from 'views/Liquidity/WithdrawLiquidity/components/AssetAmountBox'
import { PoolAsset } from 'views/Liquidity/WithdrawLiquidity/types'

import { Box, Typography, Icon } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

type Props = {
  onAmountChange: (value: string) => void
  firstAsset: PoolAsset
  secondAsset: PoolAsset
  lpAmount: string
  amount: string
  poolShare: string
}

export const AssetInput = memo(
  ({ onAmountChange, amount, lpAmount, firstAsset, secondAsset }: Props) => {
    const percentage =
      Number(lpAmount) >= Number(amount)
        ? ((Number(amount) / Number(lpAmount)) * 100).toFixed(2)
        : 100

    return (
      <div className="relative self-stretch">
        <div
          className={classNames(
            'absolute flex items-center justify-center top-1/2 rounded-3xl left-6 -translate-y-1/2 w-12 h-12',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon name="arrowDown" size={20} color="white" />
        </div>

        <Box
          className={
            'flex-col md:flex-row !mb-1 rounded-3xl py-6 px-6 bg-light-gray-light dark:bg-dark-gray-light items-end md:items-center'
          }
          minHeight={100}
        >
          <Box className="flex-1">
            <Typography
              className="inline-flex"
              color="secondary"
              variant="subtitle1"
            >
              {t('views.liquidity.amountToRemove')}
              {':'}
            </Typography>
          </Box>
          <Box className="flex-1" alignCenter>
            <Box className="flex-1">
              <Input
                stretch
                className="!text-2xl text-right mr-3"
                containerClassName="py-1"
                onChange={(event) => onAmountChange(event.target.value)}
                value={amount}
              />
            </Box>
            <Typography
              className="whitespace-nowrap"
              color="secondary"
              variant="h4"
            >
              {percentage}
              {'%'}
            </Typography>
          </Box>
        </Box>

        <Box
          className={
            'flex-col md:flex-row rounded-3xl py-4 px-6 bg-light-gray-light dark:bg-dark-gray-light items-end md:items-center'
          }
          minHeight={100}
        >
          <Box alignCenter>
            <Typography
              className="inline-flex"
              color="secondary"
              variant="subtitle1"
            >
              {t('views.liquidity.youWillReceive')}
              {':'}
            </Typography>
          </Box>

          <Box className="gap-2 md:gap-4 py-1 w-full" justify="end">
            <AssetAmountBox asset={firstAsset} amount="-" />
            <AssetAmountBox asset={secondAsset} amount="-" />
          </Box>
        </Box>
      </div>
    )
  },
)
