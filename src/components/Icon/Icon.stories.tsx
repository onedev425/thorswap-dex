import { ComponentMeta } from '@storybook/react'

import { Icon, IconProps } from './Icon'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Icon',
  component: Icon,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Icon>

const ICON_MD = 24
const ICON_LG = 36

export const All = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <div className="flex space-x-2">
        <Icon name="discord" size={ICON_MD} />
        <Icon name="medium" size={ICON_MD} />
        <Icon name="telegram" size={ICON_MD} />
        <Icon name="twitter" size={ICON_MD} />
        <Icon name="chartPie" size={ICON_MD} />
        <Icon name="chartArea" size={ICON_MD} />
        <Icon name="chartArea2" size={ICON_MD} />
        <Icon name="chartCandle" size={ICON_MD} />
        <Icon name="refresh" size={ICON_MD} />
        <Icon name="wifi" size={ICON_MD} />
      </div>
      <div className="flex space-x-2">
        <Icon name="discord" color="purple" size={ICON_LG} />
        <Icon name="medium" color="green" size={ICON_LG} />
        <Icon name="telegram" color="blue" size={ICON_LG} />
        <Icon name="twitter" color="cyan" size={ICON_LG} />
        <Icon name="chartPie" color="green" size={ICON_LG} />
        <Icon name="chartArea" color="purple" size={ICON_LG} />
        <Icon name="chartArea2" color="yellow" size={ICON_LG} />
        <Icon name="chartCandle" color="cyan" size={ICON_LG} />
        <Icon name="refresh" color="pink" size={ICON_LG} />
        <Icon name="wifi" color="cyan" size={ICON_LG} />
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
