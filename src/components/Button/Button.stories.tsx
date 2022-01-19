import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { Button } from './Button'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>

export const All = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2 items-center">
        <Button size="large" bgColor="primary">
          Default Button
        </Button>
        <Button size="large" bgColor="pink" outline>
          Outlined Button
        </Button>
        <Button size="large" bgColor="cyan" disabled>
          Disabled Button
        </Button>
        <Button size="large" borderless>
          Borderless Button
        </Button>
      </div>
      <div className="flex space-x-2 items-center">
        <Button size="small" bgColor="secondary">
          Default Button
        </Button>
        <Button size="small" bgColor="gray" outline>
          Outlined Button
        </Button>
        <Button size="small" bgColor="green" disabled>
          Disabled Button
        </Button>
        <Button size="small" borderless>
          Borderless Button
        </Button>
      </div>
    </div>
  )
}
