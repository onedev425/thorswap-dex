import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Switch } from './Switch'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Switch',
  component: Switch,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Switch>

export const Simple = () => {
  const [checked, setChange] = useState(false)

  return (
    <div className="flex items-center p-4 space-x-2 bg-light-bg-secondary dark:bg-dark-bg-secondary">
      <Switch
        selectedText="ON"
        unselectedText="OFF"
        checked={checked}
        onChange={() => {
          setChange(!checked)
        }}
      />
      <Switch
        selectedText="ON"
        unselectedText="OFF"
        checked
        onChange={() => {}}
      />
    </div>
  )
}
