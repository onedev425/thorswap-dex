import { useCallback } from 'react'

import { Button, Row } from 'components/Atomic'

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
    <Row className="gap-2">
      {options.map((option, index) => (
        <Button
          key={option}
          variant="tint"
          type={activeIndex !== index ? 'outline' : 'default'}
          onClick={() => onHandleChange(index)}
        >
          {option}
        </Button>
      ))}
    </Row>
  )
}
