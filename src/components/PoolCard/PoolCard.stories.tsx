import { ComponentMeta } from '@storybook/react'
import { Pool } from '@thorswap-lib/multichain-sdk'

import { PoolCard } from './PoolCard'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PoolCard',
  component: PoolCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PoolCard>

// @ts-expect-error TODO: Properly mock Pool data
const pool = {
  asset: {
    isSynth: false,
    chain: 'BTC',
    symbol: 'BTC',
    ticker: 'BTC',
    type: 'Native',
    name: 'BTC',
    network: 'Bitcoin',
    decimal: 8,
  },
  runeDepth: {
    decimal: 8,
    baseAmount: '486788975744885',
    assetAmount: '4867889.75744885',
  },
  assetDepth: {
    decimal: 8,
    baseAmount: '121682981174',
    assetAmount: '1216.82981174',
  },
  detail: {
    asset: 'BTC.BTC',
    assetDepth: '121682981174',
    assetPrice: '4000.4688498616206',
    assetPriceUSD: '45181.47191374788',
    liquidityUnits: '446874264970602',
    poolAPY: '0.18252958110256157',
    runeDepth: '486788975744885',
    status: 'available',
    synthSupply: '4195803531',
    synthUnits: '7839592648810',
    units: '454713857619412',
    volume24h: '37761766139090',
  },
  assetUSDPrice: {
    decimal: 8,
    assetAmount: '45181.47191374788',
    baseAmount: '4518147191374',
  },
} as Pool

export const All = () => {
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <PoolCard pool={pool} color="orange" />
    </div>
  )
}

export const Bitcoin = () => {
  return <PoolCard pool={pool} color="orange" />
}

export const Ethereum = () => {
  return <PoolCard pool={pool} color="purple" />
}
