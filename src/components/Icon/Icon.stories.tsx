import { ComponentMeta } from '@storybook/react'

import { IconName } from 'components/Icon'
import Icons from 'components/Icon/iconList'
import { Typography } from 'components/Typography'

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
        <Icon name="lightning" size={ICON_MD} />
        <Icon name="fire" size={ICON_MD} />
        <Icon name="bitcoin" size={ICON_MD} />
        <Icon name="ethereum" size={ICON_MD} />
      </div>
      <div className="flex space-x-2">
        <Icon name="discord" color="purple" size={ICON_LG} />
        <Icon name="medium" color="green" size={ICON_LG} />
        <Icon name="telegram" color="blue" size={ICON_LG} />
        <Icon name="twitter" color="cyan" size={ICON_LG} />
        <Icon name="chartPie" color="green" size={ICON_LG} />
        <Icon name="chartArea" color="primary" size={ICON_LG} />
        <Icon name="chartArea2" color="secondary" size={ICON_LG} />
        <Icon name="chartCandle" color="tertiary" size={ICON_LG} />
        <Icon name="refresh" color="pink" size={ICON_LG} />
        <Icon name="wifi" color="cyan" size={ICON_LG} />
        <Icon name="lightning" color="blueLight" size={ICON_LG} />
        <Icon name="fire" color="red" size={ICON_LG} />
        <Icon name="bitcoin" color="orange" size={ICON_LG} />
        <Icon name="ethereum" color="purple" size={ICON_LG} />
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

export const List = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      {Object.keys(Icons).map((icon) => {
        return (
          <div key={icon} className="flex">
            <Icon name={icon as IconName} size={ICON_MD} />
            <Typography className="ml-2">{icon}</Typography>
          </div>
        )
      })}
    </div>
  )
}

Random.args = {
  name: 'discord',
}
