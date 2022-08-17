import { useCallback } from 'react'

import classNames from 'classnames'

import { Icon, Box, Typography } from 'components/Atomic'

type Props = {
  value: boolean
  onValueChange: (value: boolean) => void
  label?: string
  className?: string
}

export const Checkbox = ({ value, onValueChange, label, className }: Props) => {
  const handleChange = useCallback(
    ({ target }: ToDo) => {
      onValueChange(target?.checked || !value)
    },
    [onValueChange, value],
  )

  return (
    <Box center onClick={handleChange} className={className}>
      <Typography
        className="cursor-pointer"
        fontWeight="semibold"
        component="label"
        color="secondary"
      >
        {label}
      </Typography>

      <Box center className="pr-2">
        <input
          type="checkbox"
          onChange={handleChange}
          checked={value}
          className={classNames(
            'appearance-none transition duration-200 h-6 w-6 rounded-md focus:outline-none cursor-pointer',
            { 'bg-light-bg-secondary dark:bg-dark-bg-primary': value },
          )}
        />

        {value && (
          <Icon
            className="pl-0.5 pt-0.5 absolute pointer-events-none"
            name="checkmark"
            color="primary"
            size={18}
          />
        )}
      </Box>
    </Box>
  )
}
