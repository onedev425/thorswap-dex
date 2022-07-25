import { memo } from 'react'

import { UseFormRegisterReturn } from 'react-hook-form'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { lightInputBorder } from 'components/constants'
import { FieldLabel } from 'components/Form'
import { Input } from 'components/Input'
import { useInputFocusState } from 'components/Input/hooks/useInputFocusState'

type Props = {
  label?: string
  placeholder?: string
  hasError?: boolean
  field?: UseFormRegisterReturn
}

export const TextField = memo(
  ({ label, placeholder, hasError, field }: Props) => {
    const { ref, isFocused, onFocus, onBlur } = useInputFocusState()

    return (
      <Box col flex={1}>
        <FieldLabel label={label || ''} hasError={hasError} />
        <Input
          ref={ref}
          className="py-1"
          containerClassName={classNames(lightInputBorder, {
            '!border-red': hasError,
            '!border-opacity-20': !isFocused,
          })}
          stretch
          border="rounded"
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          {...field}
        />
      </Box>
    )
  },
)
