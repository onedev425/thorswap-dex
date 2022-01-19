import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { Props as TypographyProps } from './types'
import { Typography } from './Typography'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Typography',
  component: Typography,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Typography>

export const All = (props: TypographyProps) => {
  const { color, fontWeight, component } = props

  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Typography
        variant="h1"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
      <Typography
        variant="h2"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
      <Typography
        variant="h3"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
      <Typography
        variant="h4"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
      <Typography
        variant="h5"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
      <Typography
        variant="body"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
      <Typography
        variant="caption"
        component={component}
        color={color}
        fontWeight={fontWeight}
      >
        This is Typography
      </Typography>
    </div>
  )
}
