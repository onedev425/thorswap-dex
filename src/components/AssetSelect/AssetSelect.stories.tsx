import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'
import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelect } from 'components/AssetSelect/AssetSelect'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Typography } from 'components/Atomic'

import { AssetSelectButton as AssetSelectButtonComp } from './AssetSelectButton'
import { AssetSelectList } from './AssetSelectList'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/AssetSelect',
  component: AssetSelectList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AssetSelectList>

const assets = [
  { asset: Asset.ETH(), type: 'Native token', balance: '0' },
  { asset: Asset.BTC(), type: 'Native token', balance: '4.7' },
  { asset: Asset.RUNE(), type: 'Native token', balance: '11' },
  { asset: Asset.BNB(), type: 'Native token', balance: '0' },
  { asset: Asset.DOGE(), type: 'Doge coin', balance: '38' },
] as AssetSelectType[]

const commonAssets = assets.slice(0, 3)

export const AssetSelectComponent = () => {
  return (
    <div className="flex flex-col h-screen p-4 space-y-2 bg-gray">
      <div className="flex items-center h-full max-w-lg space-x-2">
        <AssetSelectList
          assets={assets}
          onClose={() => {}}
          onSelect={() => {}}
          commonAssets={commonAssets}
        />
      </div>
    </div>
  )
}

export const AssetSelectButton = () => {
  return (
    <div className="flex flex-col p-4 space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="flex flex-col items-start gap-3 space-x-2">
        <Typography>No token selected:</Typography>
        <AssetSelectButtonComp onClick={() => {}} selected={null} />

        <Typography>With selected token selected:</Typography>
        <AssetSelectButtonComp onClick={() => {}} selected={Asset.ETH()} />
        <AssetSelectButtonComp onClick={() => {}} selected={Asset.BTC()} />
        <AssetSelectButtonComp onClick={() => {}} selected={Asset.RUNE()} />
      </div>
    </div>
  )
}

export const AssetSelectWithModal = () => {
  const [selected, setSelected] = useState<Asset | null>(null)

  return (
    <div className="flex flex-col p-4 space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div className="flex flex-col items-start gap-3 space-x-2">
        <AssetSelect
          assets={assets}
          commonAssets={commonAssets}
          onSelect={setSelected}
          selected={selected}
        />
      </div>
    </div>
  )
}
