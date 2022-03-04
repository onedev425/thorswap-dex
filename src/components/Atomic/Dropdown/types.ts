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
  onChange: (value: DropdownMenuItemValue) => void
  disabled?: boolean
}

export type DropdownMenuProps = {
  className?: string
  menuClassName?: string
  menuItems: DropdownMenuItems
  openLabel?: string
  openComponent?: JSX.Element
} & DropdownOptions
