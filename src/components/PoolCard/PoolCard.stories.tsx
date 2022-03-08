import { ComponentMeta } from '@storybook/react'
import { Asset } from '@thorswap-lib/multichain-sdk'

import { PoolCard } from './PoolCard'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PoolCard',
  component: PoolCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PoolCard>

export const All = () => {
  return (
    <div className="grid sm:grid-cols-1  md:grid-cols-3 lg:grid-cols-4 bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-5">
      <PoolCard
        asset={Asset.BTC()}
        price={65000}
        color="orange"
        iconName="bitcoin"
        change={5}
      />

      <PoolCard
        asset={Asset.ETH()}
        iconName="ethereum"
        price={3400.54}
        color="purple"
        change={-1.5}
      />
      <PoolCard
        asset={Asset.ETH()}
        iconName="ethereum"
        price={3400.54}
        color="purple"
        change={-1.5}
      />
      <PoolCard
        asset={Asset.ETH()}
        iconName="ethereum"
        price={3400.54}
        color="purple"
        change={-1.5}
      />
    </div>
  )
}

export const Bitcoin = () => {
  return (
    <PoolCard
      asset={Asset.BTC()}
      price={65000}
      color="orange"
      iconName="bitcoin"
      change={5}
    />
  )
}

export const Ethereum = () => {
  return (
    <PoolCard
      asset={Asset.ETH()}
      iconName="ethereum"
      price={3400.54}
      color="purple"
      change={-1.5}
    />
  )
}
