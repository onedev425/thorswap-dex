import { memo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Box, Icon } from 'components/Atomic'

type Props = {
  onAssetsSwap: () => void
  onAssetChange: (assetPosition: 'first' | 'second') => (asset: Asset) => void
  onBalanceChange: (
    assetPosition: 'first' | 'second',
  ) => (balance: string) => void
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

const assets = [
  { asset: Asset.ETH(), type: 'native', balance: '0', change: '0.5' },
  { asset: Asset.BTC(), type: 'native', balance: '4.7', change: '0.5' },
  { asset: Asset.RUNE(), type: '-', balance: '11', change: '0.5' },
  { asset: Asset.BNB(), type: 'native', balance: '0', change: '0.5' },
  { asset: Asset.DOGE(), type: 'native', balance: '38', change: '0.5' },
  { asset: Asset.LUNA(), type: 'native', balance: '0', change: '0.5' },
] as AssetSelectType[]

const commonAssets = assets.slice(0, 3)

export const AssetInputs = memo(
  ({
    firstAsset,
    secondAsset,
    onAssetsSwap,
    onBalanceChange,
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
            'p-1 md:p-2 rounded-2xl md:rounded-3xl',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon
            className={classNames(
              'w-[24px] h-[24px] -scale-x-100 transition-all duration-300',
              {
                'rotate-180': iconRotate,
              },
            )}
            name="exchange"
            color="white"
          />
        </Box>

        <AssetInput
          className="!mb-1"
          selectedAsset={firstAsset}
          assets={assets}
          commonAssets={commonAssets}
          secondary
          onAssetChange={onAssetChange('first')}
          onValueChange={onBalanceChange('first')}
        />
        <AssetInput
          showChange
          selectedAsset={secondAsset}
          onAssetChange={onAssetChange('second')}
          onValueChange={onBalanceChange('second')}
          assets={assets}
          commonAssets={commonAssets}
          secondary
        />
      </div>
    )
  },
)
