import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Stats } from './Stats'

export default {
  title: 'Components/Stats',
  component: Stats,
  argTypes: {},
} as ComponentMeta<typeof Stats>

const Template: ComponentStory<typeof Stats> = (args) => <Stats {...args} />

export const Primary = Template.bind({})
Primary.args = {
  iconName: 'chartPie',
  color: 'yellow',
  label: '24h Volume',
  value: '$46,82.56',
}
