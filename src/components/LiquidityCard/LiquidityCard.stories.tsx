import { ComponentMeta } from '@storybook/react'

import { LiquidityCard } from 'components/LiquidityCard'
import { AssetDataType } from 'components/LiquidityCard/types'

const Data = [
  {
    assetName: 'Pooled THOR',
    assetTicker: 'RUNE',
    amount: '37.9033',
  },
  {
    assetName: 'Pooled ETH',
    assetTicker: 'ETH',
    amount: '0.00546842',
  },
] as AssetDataType[]

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/LiquidityCard',
  component: LiquidityCard,
} as ComponentMeta<typeof LiquidityCard>

export const Default = () => <LiquidityCard data={Data} />
