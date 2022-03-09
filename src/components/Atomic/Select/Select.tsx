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
        <DropdownMenu
          menuItems={dropdownOptions}
          value={options[activeIndex]}
          openComponent={
            <Box className="gap-2" alignCenter row>
              <Typography variant="caption">{options[activeIndex]}</Typography>
            </Box>
          }
          onChange={onDropdownChange}
        />
      </Box>
    </>
  )
}
