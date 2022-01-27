import { ComponentMeta } from '@storybook/react'

import { StatsGroup } from './StatsGroup'

export default {
  title: 'Components/StatsGroup',
  component: StatsGroup,
  argTypes: {},
} as ComponentMeta<typeof StatsGroup>

export const List = () => {
  return (
    <div className="flex flex-row bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-3">
      <StatsGroup
        totalVolume={2.1}
        depositVolume={4.5}
        swapVolume={3}
        withdrawVolume={0.5}
        iconName="bitcoin"
        iconColor="yellow"
      />
      <StatsGroup
        totalVolume={2.1}
        depositVolume={4.5}
        swapVolume={3}
        withdrawVolume={0.5}
        iconName="ethereum"
        iconColor="blue"
      />
    </div>
  )
}

export const Bitcoin = () => {
  return (
    <StatsGroup
      totalVolume={2.1}
      depositVolume={4.5}
      swapVolume={3}
      withdrawVolume={0.5}
      iconName="bitcoin"
      iconColor="yellow"
    />
  )
}

export const Ethereum = () => {
  return (
    <StatsGroup
      totalVolume={2.1}
      depositVolume={4.5}
      swapVolume={3}
      withdrawVolume={0.5}
      iconName="ethereum"
      iconColor="blue"
    />
  )
}
