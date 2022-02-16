import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Input } from './Input'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Input',
  component: Input,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Input>

export const All = () => {
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Input
        icon="search"
        placeholder="Input with icon"
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <Input onChange={() => {}} value="Input With value" />
      <Input placeholder="Placeholder without icon" />
      <Input icon="chartPie" />
      <Input />
      <Input borderless placeholder="Borderless" />
      <Input borderless placeholder="Borderless" icon="bitcoin" />
    </div>
  )
}
