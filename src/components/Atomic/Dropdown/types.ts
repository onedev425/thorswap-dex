export type DropdownMenuItemValue = string

export type DropdownMenuItem = {
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
  menuItems: DropdownMenuItems
  className?: string
  openLabel?: string
  OpenComponent?: JSX.Element
} & DropdownOptions
