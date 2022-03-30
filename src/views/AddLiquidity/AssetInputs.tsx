import { memo } from 'react'

import { Asset, Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import { commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { Box, Icon } from 'components/Atomic'
import { LiquidityTypeOption } from 'components/LiquidityType/types'

type Props = {
  onPoolChange: (asset: Asset) => void
  onAssetAmountChange: (value: Amount) => void
  onRuneAmountChange: (value: Amount) => void
  poolAsset: AssetInputType
  runeAsset: AssetInputType
  poolAssetList: AssetInputType[]
  liquidityType: LiquidityTypeOption
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
  }: Props) => {
    return (
      <Box className="relative self-stretch w-full" col>
        <Box
          className={classNames(
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-2xl md:rounded-3xl',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
            'opacity-100 scale-100 transition-all',
            {
              '!scale-0 !opacity-0':
                liquidityType !== LiquidityTypeOption.SYMMETRICAL,
            },
          )}
        >
          <Icon
            className={classNames('w-6 h-6 md:w-9 md:h-9')}
            name="plus"
            color="white"
          />
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
          />
        </Box>

        <Box
          className={classNames('overflow-hidden h-[111px] transition-all', {
            '!h-[0px]': liquidityType === LiquidityTypeOption.ASSET,
          })}
        >
          <AssetInput
            className="!mb-1 flex-1"
            selectedAsset={runeAsset}
            onValueChange={onRuneAmountChange}
            singleAsset
          />
        </Box>
      </Box>
    )
  },
)
