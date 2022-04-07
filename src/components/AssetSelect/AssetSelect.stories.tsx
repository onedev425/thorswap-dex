import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'
import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelect } from 'components/AssetSelect/AssetSelect'
import { Typography } from 'components/Atomic'

import { assetsFixture, commonAssets } from 'helpers/assetsFixture'

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

export const AssetSelectComponent = () => {
  return (
    <div className="flex flex-col h-screen p-4 space-y-2 bg-gray">
      <div className="flex items-center h-full max-w-lg space-x-2">
        <AssetSelectList
          assets={assetsFixture}
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
          assets={assetsFixture}
          commonAssets={commonAssets}
          onSelect={setSelected}
          selected={selected}
        />
      </div>
    </div>
  )
}
