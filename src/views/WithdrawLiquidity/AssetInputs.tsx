import { memo } from 'react'

import { Asset, Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { WithdrawPercent } from 'views/WithdrawLiquidity/WithdrawPercent'

import { Box, Typography, Icon } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
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
  isSymmAndAssetWalletNotConnected: boolean
}

export const AssetInputs = memo(
  ({
    onPercentChange,
    percent,
    poolAsset,
    runeAmount,
    assetAmount,
    liquidityType,
    isSymmAndAssetWalletNotConnected,
  }: Props) => {
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

        <WithdrawPercent percent={percent} onChange={onPercentChange} />

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
              flex={
                liquidityType === LiquidityTypeOption.RUNE ||
                isSymmAndAssetWalletNotConnected
                  ? 0
                  : 1
              }
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
