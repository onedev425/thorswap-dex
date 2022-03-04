import { useCallback } from 'react'

import classNames from 'classnames'

import { Box, Button, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

type Props = {
  className?: string
  options: string[]
  activeIndex?: number
  onChange?: (selectedIndex: number) => void
}

export const Select = ({
  className,
  options,
  activeIndex = 0,
  onChange,
}: Props) => {
  const onHandleChange = useCallback(
    (selectedIndex: number) => {
      if (onChange) onChange(selectedIndex)
    },
    [onChange],
  )

  return (
    <>
      <Box className={classNames('hidden md:flex gap-2', className)}>
        {options.map((option, index) => (
          <Button
            key={option}
            variant="tint"
            type={activeIndex !== index ? 'outline' : 'default'}
            onClick={() => onHandleChange(index)}
          >
            <Typography variant="caption-xs">{option}</Typography>
          </Button>
        ))}
      </Box>

      <Box
        className={classNames(
          'px-3 py-2 border border-solid rounded-2xl focus:border-transparent mr-5 md:hidden',
          'border-light-border-primary dark:border-dark-border-primary focus:border-light-border-primary dark:focus:border-dark-border-primary',
        )}
      >
        <select
          className={classNames(
            'w-full border-none text-base sm:text-sm text-light-typo-primary focus:outline-none focus:ring-none dark:text-dark-typo-primary',
            genericBgClasses.secondary,
          )}
          value={activeIndex}
          onChange={(e) => onHandleChange(Number(e.target.value))}
        >
          {options.map((option, index) => (
            <option
              className="text-dark-typo-primary"
              value={index}
              key={option}
            >
              {option}
            </option>
          ))}
        </select>
      </Box>
    </>
  )
}
