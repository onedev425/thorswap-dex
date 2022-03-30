import { memo } from 'react'

import classNames from 'classnames'

import { AssetAmountBox } from 'views/WithdrawLiquidity/components/AssetAmountBox'
import { PoolAsset } from 'views/WithdrawLiquidity/types'

import { Box, Typography, Icon } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { Input } from 'components/Input'
import { useInputFocusState } from 'components/Input/hooks/useInputFocusState'
import { LiquidityTypeOption } from 'components/LiquidityType/types'

import { t } from 'services/i18n'

type Props = {
  onAmountChange: (value: string) => void
  firstAsset: PoolAsset
  secondAsset: PoolAsset
  lpAmount: string
  amount: string
  poolShare: string
  liquidityType: LiquidityTypeOption
}

export const AssetInputs = memo(
  ({
    onAmountChange,
    amount,
    firstAsset,
    secondAsset,
    liquidityType,
  }: Props) => {
    const { ref, isFocused, focus, onFocus, onBlur } = useInputFocusState()

    return (
      <div className="relative self-stretch md:w-full">
        <div
          className={classNames(
            'absolute flex items-center justify-center top-1/2 rounded-3xl left-6 -translate-y-1/2 w-[52px] h-[52px]',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon name="arrowDown" size={20} color="white" />
        </div>

        <HighlightCard
          className="min-h-[107px] p-4 !mb-1 flex-col md:flex-row items-end md:items-center"
          isFocused={isFocused}
          onClick={focus}
        >
          <Box className="flex-1">
            <Typography className="inline-flex">
              {t('views.liquidity.amountToRemove')}
              {':'}
            </Typography>
          </Box>
          <Box className="flex-1" alignCenter>
            <Box className="flex-1">
              <Input
                ref={ref}
                stretch
                className="!text-2xl text-right mr-3"
                containerClassName="py-1"
                onChange={(event) => onAmountChange(event.target.value)}
                value={amount}
                suffix={<Typography variant="subtitle1">%</Typography>}
                onFocus={onFocus}
                onBlur={onBlur}
              />
            </Box>
          </Box>
        </HighlightCard>

        <HighlightCard className="min-h-[107px] p-4 flex-col md:flex-row items-end md:items-center gap-2">
          <Box>
            <Typography className="whitespace-nowrap">
              {t('views.liquidity.youWillReceive')}
              {':'}
            </Typography>
          </Box>

          <Box className="gap-2 py-1 flex-1 self-stretch md:self-center">
            <Box
              className={classNames(
                'overflow-hidden transition-all origin-left',
                { 'scale-x-0': liquidityType === LiquidityTypeOption.RUNE },
              )}
              flex={liquidityType === LiquidityTypeOption.RUNE ? 0 : 1}
            >
              <AssetAmountBox asset={firstAsset} amount="-" stretch />
            </Box>
            <Box
              className={classNames(
                'overflow-hidden transition-all origin-right',
                { 'scale-x-0': liquidityType === LiquidityTypeOption.ASSET },
              )}
              flex={liquidityType === LiquidityTypeOption.ASSET ? 0 : 1}
            >
              <AssetAmountBox asset={secondAsset} amount="-" stretch />
            </Box>
          </Box>
        </HighlightCard>
      </div>
    )
  },
)
