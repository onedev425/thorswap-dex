import { memo } from 'react'

import classNames from 'classnames'

import { AssetAmountBox } from 'views/Liquidity/WithdrawLiquidity/components/AssetAmountBox'
import { PoolAsset } from 'views/Liquidity/WithdrawLiquidity/types'

import { Box, Typography, Icon } from 'components/Atomic'
import { Input } from 'components/Input'

import { t } from 'services/i18n'

type Props = {
  onAmountChange: (balance: string) => void
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
            '!mb-1 rounded-3xl py-6 px-6 bg-light-gray-light dark:bg-dark-gray-light'
          }
          alignCenter
          minHeight={100}
        >
          <Box minWidth={170}>
            <Typography color="secondary" variant="h5">
              {t('views.liquidity.amountToRemove')}
              {':'}
            </Typography>
          </Box>
          <Input
            border="rounded"
            stretch
            className="!text-2xl"
            onChange={(event) => onAmountChange(event.target.value)}
            value={amount}
          />
          <Typography
            className="whitespace-nowrap"
            color="secondary"
            variant="h4"
          >
            {percentage}
            {'%'}
          </Typography>
        </Box>

        <Box
          className={
            'rounded-3xl py-4 px-6 bg-light-gray-light dark:bg-dark-gray-light'
          }
          alignCenter
          justify="between"
          minHeight={100}
        >
          <Box alignCenter>
            <Typography color="secondary" variant="h5">
              {t('views.liquidity.youWillReceive')}
              {':'}
            </Typography>
          </Box>

          <Box className="gap-4">
            <AssetAmountBox asset={firstAsset} amount="-" />
            <AssetAmountBox asset={secondAsset} amount="-" />
          </Box>
        </Box>
      </div>
    )
  },
)
