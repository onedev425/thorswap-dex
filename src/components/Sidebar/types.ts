import { IconName } from '../Icon'

export type Variant = 'primary' | 'secondary'

export type NavItemProps = {
  iconName: IconName
  href: string
  variant?: Variant
  spaced?: boolean
  className?: string
  isExternal?: boolean
}

export type SidebarItemProps = {
  iconName: IconName
  label: string
  isExternal?: boolean
  href: string
  hasSub?: boolean
  children?: SidebarItemProps[]
}

export type SidebarProps = {
  options: SidebarItemProps[]
}
