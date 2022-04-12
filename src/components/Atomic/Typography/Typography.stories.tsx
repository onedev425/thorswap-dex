import { ComponentMeta } from '@storybook/react'

import { Typography } from './Typography'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Atomic',
  component: Typography,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof Typography>

export const All = () => {
  return (
    <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary p-4">
      <Typography variant="h1" transform="uppercase">
        H1 - Uppercase - Primary
      </Typography>
      <Typography variant="h2" transform="capitalize" color="secondary">
        H2 - Capitalize - Secondary
      </Typography>
      <Typography
        variant="h3"
        className="font"
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
      <Typography variant="subtitle1" color="orange" fontWeight="medium">
        Subtitle1 - Orange - Medium
      </Typography>
      <Typography variant="subtitle2" color="green">
        Subtitle2 - Green - Medium
      </Typography>
      <Typography variant="body" color="cyan" fontWeight="semibold">
        Body - Cyan - Semibold
      </Typography>
      <Typography variant="caption" color="blue" fontWeight="extrabold">
        Caption - Blue - Extra Bold
      </Typography>
      <Typography variant="caption-xs" color="red" fontWeight="extrabold">
        Caption XS - Red - Extra Bold
      </Typography>
    </div>
  )
}
