import { useCallback, useMemo } from 'react'

import classNames from 'classnames'

import { Box, Button, DropdownMenu, Typography } from 'components/Atomic'

type Props = {
  className?: string
  options: string[]
  activeIndex?: number
  onChange?: (selectedIndex: number) => void
  size?: 'md' | 'sm'
  disableDropdown?: boolean
}

export const Select = ({
  className,
  options,
  disableDropdown,
  activeIndex = 0,
  onChange,
  size = 'md',
}: Props) => {
  const onHandleChange = useCallback(
    (selectedIndex: number) => {
      onChange?.(selectedIndex)
    },
    [onChange],
  )
  const dropdownOptions = useMemo(
    () => options.map((o, idx) => ({ value: String(idx), label: o })),
    [options],
  )

  const onDropdownChange = useCallback(
    (value: string) => {
      onChange?.(Number(value))
    },
    [onChange],
  )

  return (
    <>
      <Box
        className={classNames(
          'gap-2',
          { 'hidden md:flex': !disableDropdown },
          className,
        )}
      >
        {options.map((option, index) => (
          <Button
            className={classNames('w-20', size === 'md' ? 'h-10' : 'h-8', {
              '!bg-opacity-100 dark:!bg-opacity-50': index === activeIndex,
            })}
            key={option}
            variant={activeIndex === index ? 'primary' : 'tint'}
            type={activeIndex === index ? 'default' : 'outline'}
            onClick={() => onHandleChange(index)}
          >
            <Typography
              transform="capitalize"
              className="leading-4"
              variant={size === 'md' ? 'caption' : 'caption-xs'}
            >
              {option}
            </Typography>
          </Button>
        ))}
      </Box>

      <Box className={disableDropdown ? 'hidden' : 'md:hidden'}>
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
