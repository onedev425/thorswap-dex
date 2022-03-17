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
    ({ target }) => {
      onValueChange(target?.checked || !value)
    },
    [onValueChange, value],
  )

  return (
    <Box center onClick={handleChange} className={className}>
      <Box center className="pr-2">
        <input
          type="checkbox"
          onChange={handleChange}
          checked={value}
          className={classNames(
            'appearance-none transition duration-200 h-6 w-6 rounded-md focus:outline-none cursor-pointer',
            'border-[1.5px] border-solid border-dark-bg-secondary dark:border-dark-bg-secondary',
            'bg-transparent checked:bg-dark-bg-secondary checked:dark:bg-dark-bg-secondary',
          )}
        />

        {value && (
          <Icon
            className="pl-0.5 pt-0.5 absolute pointer-events-none"
            name="checkmark"
            color="white"
            size={18}
          />
        )}
      </Box>

      <Typography fontWeight="semibold" component="label" color="secondary">
        {label}
      </Typography>
    </Box>
  )
}
