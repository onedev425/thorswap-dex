import { IconName } from 'components/Atomic'

export type Variant = 'primary' | 'secondary'

type ItemProps = {
  iconName: IconName
  href: string
  isExternal?: boolean
  label?: string
}

export type NavItemProps = ItemProps & {
  variant?: Variant
  className?: string
  collapsed?: boolean
}

export type SidebarItemProps = ItemProps & {
  label: string
  hasSub?: boolean
  children?: SidebarItemProps[]
}

export type SidebarProps = {
  className?: string
  options?: SidebarItemProps[]
  collapsed?: boolean
  toggle?: () => void
}
