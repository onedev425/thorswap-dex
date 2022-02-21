import { ComponentMeta } from '@storybook/react'

import { Typography, Button } from 'components/Atomic'

import { Link } from './Link'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Link',
  component: Link,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Link>

export const BasicLink = () => {
  return <Link to="https://thorswap.finance/">Visit ThorSwap</Link>
}

export const TypographyLink = () => {
  return (
    <Link to="https://thorswap.finance/">
      <Typography variant="h4">Visit ThorSwap</Typography>
    </Link>
  )
}

export const ComponentLink = () => {
  return (
    <Link to="https://thorswap.finance/">
      <Button>Visit ThorSwap</Button>
    </Link>
  )
}

export const LinkWithClassname = () => {
  return (
    <Link
      to="https://thorswap.finance/"
      className="hover:underline hover:decoration-green"
    >
      <Typography variant="h3">Visit ThorSwap</Typography>
    </Link>
  )
}
