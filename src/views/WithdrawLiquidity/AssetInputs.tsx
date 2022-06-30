import { useCallback, memo, useState, useEffect } from 'react'

import { Asset, Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { Box, Typography, Icon, Button, Range } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { useInputFocusState } from 'components/Input/hooks/useInputFocusState'
import { InputAmount } from 'components/InputAmount'
import { getAmountFromString } from 'components/InputAmount/utils'
import { LiquidityTypeOption } from 'components/LiquidityType/types'

import { t } from 'services/i18n'

import { AssetAmountBox } from './AssetAmountBox'

type Props = {
  poolAsset: Asset
  percent: Amount
  runeAmount: Amount
  assetAmount: Amount
  onPercentChange: (value: Amount) => void
  liquidityType: LiquidityTypeOption
}

export const AssetInputs = memo(
  ({
    onPercentChange,
    percent,
    poolAsset,
    runeAmount,
    assetAmount,
    liquidityType,
  }: Props) => {
    const { ref, isFocused, focus, onFocus, onBlur } = useInputFocusState()
    const [range, setRange] = useState<Amount>(Amount.fromNormalAmount(0))

    const handlePercentChange = useCallback(
      (value: Amount) => {
        const val = value.gt(100) ? Amount.fromNormalAmount(100) : value
        setRange(val)
        onPercentChange(val)
      },
      [onPercentChange],
    )

    const handleRange = (value: Amount) => {
      setRange(value)
      handlePercentChange(value)
    }

    useEffect(() => {
      setRange(percent)
    }, [percent])

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
          className="min-h-[107px] p-4 !mb-1 flex-row items-center justify-start"
          isFocused={isFocused}
          onClick={focus}
        >
          <Box className="w-full row-span-1 flex-row">
            <Box className="flex-1 items-center" alignCenter>
              <Typography className="inline-flex">
                {`${t('common.withdrawPercent')}:`}
              </Typography>
            </Box>

            <Box className="flex-1" alignCenter>
              <Box className="flex-1">
                <InputAmount
                  ref={ref}
                  stretch
                  className="!text-2xl text-right mr-3"
                  containerClassName="py-1"
                  onAmountChange={handlePercentChange}
                  amountValue={percent}
                  suffix={<Typography variant="subtitle1">%</Typography>}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </Box>
            </Box>
          </Box>

          <Box
            className="flex-row pb-8 row-span-1 w-full sm:items-start md:items-center gap-x-6"
            alignCenter
            row
          >
            <Box className="w-11/12">
              <Range onAmountChange={handleRange} amountValue={range} />
            </Box>

            <Box className="flex-auto" center row>
              <Button
                className="!h-5 !px-1.5"
                type="outline"
                variant="secondary"
                transform="uppercase"
                onClick={() =>
                  handlePercentChange(getAmountFromString('100', 0) as Amount)
                }
              >
                {t('common.max')}
              </Button>
            </Box>
          </Box>
        </HighlightCard>

        <HighlightCard className="min-h-[107px] p-4 flex-col md:flex-row items-end md:items-center gap-2">
          <Box>
            <Typography className="whitespace-nowrap">
              {`${t('common.receive')}:`}
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
              <AssetAmountBox
                asset={poolAsset}
                amount={assetAmount.toSignificant(6)}
                stretch
              />
            </Box>
            <Box
              className={classNames(
                'overflow-hidden transition-all origin-right',
                { 'scale-x-0': liquidityType === LiquidityTypeOption.ASSET },
              )}
              flex={liquidityType === LiquidityTypeOption.ASSET ? 0 : 1}
            >
              <AssetAmountBox
                asset={Asset.RUNE()}
                amount={runeAmount.toSignificant(6)}
                stretch
              />
            </Box>
          </Box>
        </HighlightCard>
      </div>
    )
  },
)
