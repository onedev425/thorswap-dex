import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Typography } from 'components/Typography'

import { Card } from './Card'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Card',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Card>

export const All = () => {
  return (
    <div className="flex flex-col space-y-2 bg-light-bg-primary dark:bg-dark-bg-primary p-4 gap-5">
      <Card size="md">
        <Typography>Medium Size Card</Typography>
      </Card>

      <Card size="lg">
        <Typography>Large Size Card</Typography>
      </Card>
    </div>
  )
}

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args) => <Card {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  children: <Typography>Medium Size Card</Typography>,
}

export const Large = Template.bind({})
Large.args = {
  children: <Typography>Large Size Card</Typography>,
  size: 'lg',
}

export const Stretched = Template.bind({})
Stretched.args = {
  children: <Typography>Stretched Card</Typography>,
  size: 'md',
  stretch: true,
}
