import { useCallback, useMemo } from 'react'

import classNames from 'classnames'

import { Box, Button, DropdownMenu, Typography } from 'components/Atomic'

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
  const dropdownOptions = useMemo(
    () => options.map((o, idx) => ({ value: String(idx), label: o })),
    [options],
  )
  const onDropdownChange = (value: string) => {
    onChange?.(Number(value))
  }

  return (
    <>
      <Box className={classNames('hidden md:flex gap-2', className)}>
        {options.map((option, index) => (
          <Button
            className={classNames({
              '!bg-opacity-100 dark:!bg-opacity-50': index === activeIndex,
            })}
            key={option}
            variant={activeIndex === index ? 'primary' : 'tint'}
            type={activeIndex === index ? 'default' : 'outline'}
            onClick={() => onHandleChange(index)}
          >
            {option}
          </Button>
        ))}
      </Box>

      <Box className="md:hidden">
        <DropdownMenu
          menuItems={dropdownOptions}
          value={options[activeIndex]}
          openComponent={
            <Box className="gap-2 w-fit" alignCenter>
              <Typography variant="caption">{options[activeIndex]}</Typography>
            </Box>
          }
          onChange={onDropdownChange}
        />
      </Box>
    </>
  )
}
