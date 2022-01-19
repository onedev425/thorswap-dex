import React from 'react'

import { ComponentMeta } from '@storybook/react'

import { Typography } from './Typography'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Typography',
  component: Typography,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Typography>

export const All = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Typography variant="h1" transform="uppercase" fontWeight="thin">
        H1 - Uppercase - Primary - Thin
      </Typography>
      <Typography
        variant="h2"
        transform="capitalize"
        color="secondary"
        fontWeight="extralight"
      >
        H2 - Capitalize - Secondary - ExtraLight
      </Typography>
      <Typography
        variant="h3"
        transform="lowercase"
        color="pink"
        fontWeight="light"
      >
        H3 - Lowercase - Pink - Light
      </Typography>
      <Typography variant="h4" color="purple" fontWeight="normal">
        H4 - Purple - Normal
      </Typography>
      <Typography variant="h5" color="yellow" fontWeight="medium">
        H5 - Yellow - Medium
      </Typography>
      <Typography variant="body" color="cyan" fontWeight="semibold">
        Body - Cyan - Semibold
      </Typography>
      <Typography variant="caption" color="blue" fontWeight="extrabold">
        Caption - Blue - Extra Bold
      </Typography>
    </div>
  )
}
