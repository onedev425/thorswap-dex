export type DropdownMenuItemValue = string

export type DropdownMenuItem = {
  className?: string
  value: DropdownMenuItemValue
  label?: string
  Component?: JSX.Element
  disabled?: boolean
}

export type DropdownMenuItems = DropdownMenuItem[]

export type DropdownOptions = {
  className?: string
  value: DropdownMenuItemValue
  disabled?: boolean
  onChange: (value: DropdownMenuItemValue) => void
}

export type DropdownMenuProps = {
  className?: string
  menuClassName?: string
  menuItems: DropdownMenuItems
  openLabel?: string
  openComponent?: JSX.Element
} & DropdownOptions
