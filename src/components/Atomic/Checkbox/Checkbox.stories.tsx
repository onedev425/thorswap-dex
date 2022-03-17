import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Checkbox } from './Checkbox'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Checkbox',
  component: Checkbox,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Checkbox>

export const All = () => {
  const [value, setValue] = useState(false)

  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Checkbox value={false} onValueChange={() => {}} />
      <Checkbox value onValueChange={() => {}} />
      <Checkbox
        value={value}
        onValueChange={setValue}
        label="Check with value"
      />
    </div>
  )
}
