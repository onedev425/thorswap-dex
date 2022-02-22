import { ComponentMeta } from '@storybook/react'

import { Box, Card, Icon, Typography } from 'components/Atomic'

import { Popover } from './Popover'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Popover',
  component: Popover,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Popover>

export const PopoverBottomEnd = () => {
  return (
    <div className="flex bg-light-bg-primary dark:bg-dark-bg-primary px-10 py-60 justify-center">
      <Box>
        <Popover
          trigger={
            <Icon
              color="secondary"
              name="cog"
              className="ml-6"
              onClick={() => {}}
            />
          }
        >
          <Card>
            <Typography>{'Some Content'}</Typography>
          </Card>
        </Popover>
      </Box>
    </div>
  )
}
