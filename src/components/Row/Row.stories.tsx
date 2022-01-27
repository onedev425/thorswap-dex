import { ComponentMeta } from '@storybook/react'

import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

import { Row } from './Row'
import { Props as RowProps } from './types'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Row',
  component: Row,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Row>

export const All = (args: RowProps) => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Row {...args}>
        <Typography>Typography 1</Typography>
        <Icon name="chartCandle" size={36} color="cyan" />
        <Typography>Typography 3</Typography>
      </Row>
    </div>
  )
}
