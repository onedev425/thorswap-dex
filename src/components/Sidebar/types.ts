import { IconName } from '../Icon'

export type Variant = 'primary' | 'secondary'

type ItemProps = {
  iconName: IconName
  href: string
  isExternal?: boolean
  tooltip?: string
}

export type NavItemProps = ItemProps & {
  variant?: Variant
  className?: string
}

export type SidebarItemProps = ItemProps & {
  label: string
  hasSub?: boolean
  children?: SidebarItemProps[]
}

export type SidebarProps = {
  options?: SidebarItemProps[]
}
