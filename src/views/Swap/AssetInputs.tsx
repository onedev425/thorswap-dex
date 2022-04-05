import { memo, useState } from 'react'

import { Asset, Amount } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import { commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { Box, Icon } from 'components/Atomic'

type Props = {
  onSwitchPair: () => void
  onInputAssetChange: (asset: Asset) => void
  onOutputAssetChange: (asset: Asset) => void
  onInputAmountChange: (value: Amount) => void
  inputAsset: AssetInputType
  outputAsset: AssetInputType
  inputAssetList: AssetInputType[]
  outputAssetList: AssetInputType[]
}

export const AssetInputs = memo(
  ({
    inputAsset,
    outputAsset,
    inputAssetList,
    outputAssetList,
    onInputAssetChange,
    onOutputAssetChange,
    onInputAmountChange,
    onSwitchPair,
  }: Props) => {
    const [iconRotate, setIconRotate] = useState(false)

    const handleAssetSwap = () => {
      onSwitchPair()
      setIconRotate((rotate) => !rotate)
    }

    return (
      <div className="relative self-stretch md:w-full">
        <Box
          center
          onClick={handleAssetSwap}
          className={classNames(
            'absolute -mt-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-xl md:rounded-[16px] cursor-pointer',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary hover:brightness-125 transition',
          )}
        >
          <Icon
            className={classNames('w-7 h-7 -scale-x-100 transition-all', {
              'rotate-180': iconRotate,
            })}
            name="exchange"
            color="white"
          />
        </Box>

        <AssetInput
          className="!mb-1"
          selectedAsset={inputAsset}
          assets={inputAssetList}
          commonAssets={commonAssets}
          onAssetChange={onInputAssetChange}
          onValueChange={onInputAmountChange}
        />
        <AssetInput
          selectedAsset={outputAsset}
          onAssetChange={onOutputAssetChange}
          assets={outputAssetList}
          commonAssets={commonAssets}
          hideMaxButton
        />
      </div>
    )
  },
)
