import { ComponentMeta } from '@storybook/react'

import { Statistics } from './Statistics'

export default {
  title: 'Components/Statistics',
  component: Statistics,
  argTypes: {},
} as ComponentMeta<typeof Statistics>

export const All = () => {
  return (
    <div className="flex flex-col gap-5 p-4 md:flex-row bg-light-bg-primary dark:bg-dark-bg-primary">
      <Statistics title="Volume" amount={103000.69} change={0} value={2890} />
      <Statistics
        title="Liquidity"
        amount={2000.04}
        change={44.3}
        value={1003}
      />
    </div>
  )
}

export const Negative = () => {
  return (
    <div className="p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <Statistics title="Volume" amount={103000.69} change={-4} value={2890} />
    </div>
  )
}

export const Positive = () => {
  return (
    <div className="p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <Statistics
        title="Liquidity"
        amount={2000.04}
        change={44.3}
        value={1003}
      />
    </div>
  )
}

export const Percentage = () => {
  return (
    <div className="p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <Statistics
        amount={2000.04}
        change={44.3}
        percentage
        title="Liquidity"
        value={1003}
      />
    </div>
  )
}
