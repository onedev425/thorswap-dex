import { ComponentMeta } from '@storybook/react'
import { Asset } from '@thorswap-lib/multichain-sdk'

import { LiquidityCard } from 'components/LiquidityCard'
import { AssetDataType } from 'components/LiquidityCard/types'

const mockData = [
  {
    assetName: 'Pooled THOR',
    asset: Asset.RUNE(),
    amount: '37.9033',
  },
  {
    assetName: 'Pooled ETH',
    asset: Asset.ETH(),
    amount: '0.00546842',
  },
] as AssetDataType[]

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/LiquidityCard',
  component: LiquidityCard,
} as ComponentMeta<typeof LiquidityCard>

export const Default = () => <LiquidityCard data={mockData} />
