import { ComponentMeta } from '@storybook/react'

import { StakingCard } from './StakingCard'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/StakingCard',
  component: StakingCard,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof StakingCard>

export const All = () => {
  return (
    <div className="grid sm:grid-cols-1  md:grid-cols-2 lg:grid-cols-3 bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-5">
      <StakingCard />
      <StakingCard />
    </div>
  )
}

export const Single = () => {
  return <StakingCard />
}
