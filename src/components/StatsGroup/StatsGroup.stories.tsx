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
        iconName="bitcoin"
        iconColor="yellow"
        stats={[
          {
            label: 'Total Volume',
            value: 2.1,
          },
          {
            label: 'Deposit Volume',
            value: 4.5,
          },
          {
            label: 'Swap Volume',
            value: 3,
          },
          {
            label: 'Withdraw Volume',
            value: 0.5,
          },
        ]}
      />
      <StatsGroup
        iconName="ethereum"
        iconColor="blue"
        stats={[
          {
            label: 'Total Volume',
            value: 2.1,
          },
          {
            label: 'Deposit Volume',
            value: 4.5,
          },
          {
            label: 'Swap Volume',
            value: 3,
          },
          {
            label: 'Withdraw Volume',
            value: 0.5,
          },
        ]}
      />
    </div>
  )
}

export const Bitcoin = () => {
  return (
    <div className="flex flex-row bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-3">
      <StatsGroup
        iconName="bitcoin"
        iconColor="yellow"
        stats={[
          {
            label: 'Total Volume',
            value: '$2.1B',
          },
          {
            label: 'Deposit Volume',
            value: '$275.63M',
          },
          {
            label: 'Swap Volume',
            value: '$1.54B',
          },
          {
            label: 'Withdraw Volume',
            value: '$191.86M',
          },
        ]}
      />
    </div>
  )
}

export const Ethereum = () => {
  return (
    <StatsGroup
      iconName="ethereum"
      iconColor="blue"
      stats={[
        {
          label: 'Total Volume',
          value: 2.1,
        },
        {
          label: 'Deposit Volume',
          value: 4.5,
        },
        {
          label: 'Swap Volume',
          value: 3,
        },
        {
          label: 'Withdraw Volume',
          value: 0.5,
        },
      ]}
    />
  )
}
