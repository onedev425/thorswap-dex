import { memo, useState } from 'react'

import classNames from 'classnames'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetInput } from 'components/AssetInput'
import { AssetInputType } from 'components/AssetInput/types'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Icon } from 'components/Icon'

type Props = {
  onAssetsSwap: () => void
  onAssetChange: (
    assetPosition: 'first' | 'second',
  ) => (asset: AssetTickerType) => void
  onBalanceChange: (
    assetPosition: 'first' | 'second',
  ) => (balance: string) => void
  firstAsset: AssetInputType
  secondAsset: AssetInputType
}

const assets = [
  { name: 'ETH', type: 'native', balance: '0', change: '0.5' },
  { name: 'BTC', type: 'native', balance: '4.7', change: '0.5' },
  { name: 'RUNE', type: '-', balance: '11', change: '0.5' },
  { name: 'BNB', type: 'native', balance: '0', change: '0.5' },
  { name: 'DOGE', type: 'native', balance: '38', change: '0.5' },
  { name: 'SXP', type: 'native', balance: '0', change: '0.5' },
  { name: 'WETH', type: 'wrapped', balance: '0', change: '0.5' },
  { name: 'BUSD', type: 'erc 20', balance: '0', change: '0.5' },
  { name: 'STYL', type: 'native', balance: '0', change: '0.5' },
  { name: 'DAI', type: '-', balance: '0', change: '0.5' },
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
      <div className="relative self-stretch">
        <div
          onClick={handleAssetSwap}
          className={classNames(
            'absolute flex items-center justify-center top-1/2 p-2 rounded-3xl left-1/2 -translate-x-1/2 -translate-y-1/2',
            'border-10 border-solid bg-blue dark:border-dark-border-primary border-light-border-primary',
          )}
        >
          <Icon
            name="exchange"
            size={36}
            color="white"
            className={classNames('-scale-x-100 transition-all', {
              'rotate-180': iconRotate,
            })}
          />
        </div>

        <AssetInput
          selectedAsset={firstAsset}
          onAssetChange={onAssetChange('first')}
          onValueChange={onBalanceChange('first')}
          assets={assets}
          commonAssets={commonAssets}
          secondary
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
