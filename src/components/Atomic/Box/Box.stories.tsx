import { ComponentMeta } from '@storybook/react'

import { Typography } from 'components/Atomic'

import { Box } from './Box'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Box',
  component: Box,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Box>

export const All = () => {
  return (
    <Box className="flex flex-wrap gap-3 p-4 bg-gray items-start" col>
      <Box className="w-[500px] bg-orange">
        <Box className="bg-blue" center>
          <Typography>Regular flex box (row)</Typography>
        </Box>
        <Box className="bg-green h-16" center>
          <Typography>2nd item</Typography>
        </Box>
      </Box>

      <Box className="w-[500px] bg-orange" col>
        <Box className="bg-blue" center>
          <Typography>Regular flex box (row)</Typography>
        </Box>
        <Box className="bg-green  h-16" center>
          <Typography>2nd item</Typography>
        </Box>
      </Box>

      <Box className="w-[500px] bg-orange" alignCenter>
        <Box className="bg-blue" center>
          <Typography>alignCenter flex box (row)</Typography>
        </Box>
        <Box className="bg-green h-16" center>
          <Typography>2nd item</Typography>
        </Box>
      </Box>

      <Box className="w-[500px] bg-orange" justifyCenter>
        <Box className="bg-blue" center>
          <Typography>justifyCenter flex box (row)</Typography>
        </Box>
        <Box className="bg-green h-16" center>
          <Typography>2nd item</Typography>
        </Box>
      </Box>

      <Box className="w-[500px] bg-orange" center>
        <Box className="bg-blue" center>
          <Typography>center flex box (row)</Typography>
        </Box>
        <Box className="bg-green h-16" center>
          <Typography>2nd item</Typography>
        </Box>
      </Box>

      <Box className="w-[500px] bg-orange" align="end" justify="between">
        <Box className="bg-blue" center>
          <Typography>align-end justify-between flex box (row)</Typography>
        </Box>
        <Box className="bg-green h-16" center>
          <Typography>2nd item</Typography>
        </Box>
      </Box>
    </Box>
  )
}
