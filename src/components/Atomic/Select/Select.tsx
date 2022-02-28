import { useCallback } from 'react'

import classNames from 'classnames'

import { Box, Button, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

export type Props = {
  options: string[]
  activeIndex?: number
  onChange?: (selectedIndex: number) => void
}

export const Select = (props: Props) => {
  const { options, activeIndex = 0, onChange } = props

  const onHandleChange = useCallback(
    (selectedIndex: number) => {
      if (onChange) onChange(selectedIndex)
    },
    [onChange],
  )

  return (
    <>
      <Box className="hidden md:flex gap-2">
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

      <Box className="md:hidden">
        <select
          className={classNames(
            'block w-full pl-3 pr-5 py-2 text-base border focus:outline-none focus:ring-none focus:border-transparent sm:text-sm rounded-2xl text-light-typo-primary dark:text-dark-typo-primary',
            'border-light-border-primary dark:border-dark-border-primary focus:border-light-border-primary dark:focus:border-dark-border-primary',
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
