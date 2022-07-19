import { memo } from 'react'

import { Typography } from 'components/Atomic'

type Props = {
  label: string
  hasError?: boolean
}

export const FieldLabel = memo(({ label, hasError }: Props) => {
  return (
    <Typography
      className="mx-2 mb-0.5"
      variant="caption"
      color={hasError ? 'red' : 'primary'}
    >
      {label}
    </Typography>
  )
})
