import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { AssetTickerType } from 'components/AssetIcon/types'
import { AssetSelect } from 'components/AssetSelect/AssetSelect'
import { AssetSelectType } from 'components/AssetSelect/types'
import { Typography } from 'components/Typography'

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
  { name: 'ETH', type: 'Native token', balance: '0' },
  { name: 'BTC', type: 'Native token', balance: '4.7' },
  { name: 'RUNE', type: 'Native token', balance: '11' },
  { name: 'BNB', type: 'Native token', balance: '0' },
  { name: 'DOGE', type: 'Doge coin', balance: '38' },
  { name: 'SXP', type: '-', balance: '0' },
  { name: 'WETH', type: '-', balance: '0' },
  { name: 'BUSD', type: '-', balance: '0' },
  { name: 'STYL', type: '-', balance: '0' },
  { name: 'DAI', type: '-', balance: '0' },
] as AssetSelectType[]

const commonAssets = assets.slice(0, 3)

export const AssetSelectComponent = () => {
  return (
    <div className="flex flex-col space-y-2 bg-gray p-4 h-screen">
      <div className="flex space-x-2 items-center max-w-lg h-full">
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
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2 flex-col items-start gap-3">
        <Typography>No token selected:</Typography>
        <AssetSelectButtonComp onClick={() => {}} selected={null} />

        <Typography>With selected token selected:</Typography>
        <AssetSelectButtonComp onClick={() => {}} selected="ETH" />
        <AssetSelectButtonComp onClick={() => {}} selected="BTC" />
        <AssetSelectButtonComp onClick={() => {}} selected="RUNE" />
      </div>
    </div>
  )
}

export const AssetSelectWithModal = () => {
  const [selected, setSelected] = useState<AssetTickerType | null>(null)

  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2 flex-col items-start gap-3">
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
