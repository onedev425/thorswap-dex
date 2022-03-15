import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Box, Button } from 'components/Atomic'

import { Confirm } from './Confirm'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Confirm',
  component: Confirm,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Confirm>

export const Default = () => {
  const [isOpened, setIsOpened] = useState(false)

  return (
    <Box>
      <Button onClick={() => setIsOpened(true)}>Open confirm</Button>

      <Confirm
        isOpened={isOpened}
        onConfirm={() => {
          setIsOpened(false)
          console.log('Confirmed!')
        }}
        onCancel={() => {
          setIsOpened(false)
          console.log('Cancelled!')
        }}
        description={'Are you sure you want to proceed with this action?'}
      ></Confirm>
    </Box>
  )
}
