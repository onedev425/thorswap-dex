import { ComponentMeta } from '@storybook/react'
import { Amount, Asset } from '@thorswap-lib/multichain-sdk'

import { LiquidityCard } from 'components/LiquidityCard'

import { PoolShareType } from 'store/midgard/types'

const pool = {
  asset: Asset.RUNE(),
  runeDepth: Amount.fromNormalAmount('1.1338308858108823'),
  assetDepth: Amount.fromNormalAmount('1.1338308858108823'),
  detail: {
    asset: 'TERRA.UST',
    assetDepth: '930204827114300',
    assetPrice: '0.0967704256156705',
    assetPriceUSD: '1.1338308858108823',
    liquidityUnits: '86906130870891',
    poolAPR: '0.3324196517250051',
    runeDepth: '90016317029602',
    status: 'available',
    synthSupply: '34885824420124',
    synthUnits: '1660779209281',
    units: '88566910080172',
    volume24h: '19514285999315',
  },
  assetUSDPrice: Amount.fromNormalAmount('1.1338308858108823'),
}

const data = {
  pool,
  assetAdded: '1',
  assetAddress: '1',
  assetPending: '1',
  assetWithdrawn: '1',
  dateFirstAdded: '1',
  dateLastAdded: '1',
  liquidityUnits: '1',
  runeAdded: '1',
  runeAddress: '1',
  runePending: '1',
  runeWithdrawn: '1',
  shareType: PoolShareType.SYM,
}

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/LiquidityCard',
  component: LiquidityCard,
} as ComponentMeta<typeof LiquidityCard>

// @ts-expect-error TODO: Mock data for liquidity pools
export const Default = () => <LiquidityCard {...data} />
