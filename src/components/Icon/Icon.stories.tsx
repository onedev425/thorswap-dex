import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { Icon, Props as IconProps } from './Icon'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Icon',
  component: Icon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Icon>

export const All = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2">
        <Icon name="discord" size={24} />
        <Icon name="medium" size={24} />
        <Icon name="telegram" size={24} />
        <Icon name="twitter" size={24} />
      </div>
      <div className="flex space-x-2">
        <Icon name="discord" color="purple" size={36} />
        <Icon name="medium" color="green" size={36} />
        <Icon name="telegram" color="blue" size={36} />
        <Icon name="twitter" color="cyan" size={36} />
      </div>
    </div>
  )
}

export const Random = (args: IconProps) => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Icon {...args} />
    </div>
  )
}

Random.args = {
  name: 'discord',
}
