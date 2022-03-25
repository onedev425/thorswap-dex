import { memo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'
import { assetsFixture, commonAssets } from 'utils/assetsFixture'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { Box, Icon } from 'components/Atomic'

type Props = {
  onAssetsSwap: () => void
  onAssetChange: (assetPosition: 'first' | 'second') => (asset: Asset) => void
  onValueChange: (assetPosition: 'first' | 'second') => (value: string) => void
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

export const AssetInputs = memo(
  ({
    firstAsset,
    secondAsset,
    onAssetsSwap,
    onValueChange,
    onAssetChange,
  }: Props) => {
    const [iconRotate, setIconRotate] = useState(false)

    const handleAssetSwap = () => {
      onAssetsSwap()
      setIconRotate((rotate) => !rotate)
    }

    return (
      <div className="relative self-stretch md:w-full">
        <Box
          center
          onClick={handleAssetSwap}
          className={classNames(
            'absolute -mt-0.5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
            'p-1 md:p-2 rounded-2xl md:rounded-3xl cursor-pointer',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon
            className={classNames(
              'w-6 h-6 md:w-9 md:h-9 -scale-x-100 transition-all duration-300',
              { 'rotate-180': iconRotate },
            )}
            name="exchange"
            color="white"
          />
        </Box>

        <AssetInput
          className="!mb-1"
          selectedAsset={firstAsset}
          assets={assetsFixture}
          commonAssets={commonAssets}
          onAssetChange={onAssetChange('first')}
          onValueChange={onValueChange('first')}
        />
        <AssetInput
          showChange
          selectedAsset={secondAsset}
          onAssetChange={onAssetChange('second')}
          onValueChange={onValueChange('second')}
          assets={assetsFixture}
          commonAssets={commonAssets}
        />
      </div>
    )
  },
)
