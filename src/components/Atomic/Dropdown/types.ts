export type DropdownMenuItem = {
  className?: string
  value: string
  label?: string
  Component?: JSX.Element
  disabled?: boolean
}

export type DropdownOptions = {
  className?: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}
