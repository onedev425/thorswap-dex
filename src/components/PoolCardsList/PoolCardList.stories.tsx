import { ComponentMeta } from '@storybook/react'

import { PoolCardList } from './PoolCardList'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/PoolCardList',
  component: PoolCardList,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof PoolCardList>

export const List = () => {
  return <PoolCardList />
}
