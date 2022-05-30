import { memo } from 'react'

import { Asset, Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { Box, Icon } from 'components/Atomic'
import { LiquidityTypeOption } from 'components/LiquidityType/types'

import { t } from 'services/i18n'

import { commonAssets } from 'helpers/assetsFixture'

type Props = {
  onPoolChange: (asset: Asset) => void
  onAssetAmountChange: (value: Amount) => void
  onRuneAmountChange: (value: Amount) => void
  poolAsset: AssetInputType
  runeAsset: AssetInputType
  poolAssetList: AssetInputType[]
  liquidityType: LiquidityTypeOption
  isRunePending: boolean
  isAssetPending: boolean
}

export const AssetInputs = memo(
  ({
    poolAsset,
    runeAsset,
    poolAssetList,
    onAssetAmountChange,
    onRuneAmountChange,
    onPoolChange,
    liquidityType,
    isAssetPending,
    isRunePending,
  }: Props) => {
    return (
      <Box className="relative self-stretch w-full" col>
        <Box
          className={classNames(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-xl md:rounded-[18px]',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-transparent',
            'opacity-100 scale-100 transition-all',
            {
              '!scale-0 !opacity-0':
                liquidityType !== LiquidityTypeOption.SYMMETRICAL,
            },
          )}
        >
          <Icon className={classNames('w-7 h-7')} name="plus" color="white" />
        </Box>

        <Box
          className={classNames('overflow-hidden h-[111px] transition-all', {
            '!h-[0px]': liquidityType === LiquidityTypeOption.RUNE,
          })}
        >
          <AssetInput
            className="!mb-1 flex-1"
            selectedAsset={poolAsset}
            onAssetChange={onPoolChange}
            onValueChange={onAssetAmountChange}
            assets={poolAssetList}
            commonAssets={commonAssets}
            disabled={isAssetPending}
            warning={
              isAssetPending
                ? t('pendingLiquidity.content', { asset: Asset.RUNE().ticker })
                : ''
            }
            maxButtonLabel={isRunePending ? t('pendingLiquidity.complete') : ''}
          />
        </Box>

        <Box
          className={classNames('overflow-hidden transition-all', {
            '!h-[0px]': liquidityType === LiquidityTypeOption.ASSET,
            'h-[111px] ': liquidityType !== LiquidityTypeOption.RUNE,
            'h-[140px] md:h-[111px]':
              liquidityType === LiquidityTypeOption.RUNE,
          })}
        >
          <AssetInput
            className="!mb-1 flex-1"
            selectedAsset={runeAsset}
            onValueChange={onRuneAmountChange}
            onAssetChange={onPoolChange}
            poolAsset={poolAsset}
            showSecondaryChainSelector={
              liquidityType === LiquidityTypeOption.RUNE
            }
            assets={poolAssetList}
            commonAssets={commonAssets}
            singleAsset
            disabled={isRunePending}
            warning={
              isRunePending
                ? t('pendingLiquidity.content', {
                    asset: poolAsset.asset.ticker,
                  })
                : ''
            }
            maxButtonLabel={
              isAssetPending ? t('pendingLiquidity.complete') : ''
            }
          />
        </Box>
      </Box>
    )
  },
)
