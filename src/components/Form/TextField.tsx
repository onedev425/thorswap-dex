import { memo } from 'react'

import { UseFormRegisterReturn } from 'react-hook-form'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { FieldLabel } from 'components/Form'
import { Input } from 'components/Input'

type Props = {
  label?: string
  placeholder?: string
  hasError?: boolean
  field?: UseFormRegisterReturn
}

export const TextField = memo(
  ({ label, placeholder, hasError, field }: Props) => (
    <Box col flex={1}>
      <FieldLabel label={label || ''} hasError={hasError} />
      <Input
        className="py-1"
        containerClassName={classNames({
          '!border-red': hasError,
        })}
        stretch
        border="rounded"
        placeholder={placeholder}
        {...field}
      />
    </Box>
  ),
)
