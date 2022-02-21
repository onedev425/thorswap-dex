import React from 'react'

export type SwitchProps = {
  className?: string
  selectedText?: string
  unselectedText?: string
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  checked?: boolean
}
