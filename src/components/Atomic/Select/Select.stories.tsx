import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Select } from './Select'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Select',
  component: Select,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Select>

export const All = () => {
  const [activeIndex, setActiveIndex] = useState(1)

  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Select
        options={['All', 'Native', 'ERC20', 'BEP2']}
        activeIndex={activeIndex}
        onChange={setActiveIndex}
      />
    </div>
  )
}
