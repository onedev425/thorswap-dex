import { MouseEventHandler } from 'react'

import { IconName, TextTransform } from 'components/Atomic'

export type SidebarVariant = 'primary' | 'secondary'

type ItemProps = {
  iconName: IconName
  rightIconName?: IconName
  hasBackground?: boolean
  href: string
  label?: string
}

export type NavItemProps = ItemProps & {
  transform?: TextTransform
  variant?: SidebarVariant
  className?: string
  collapsed?: boolean
  onClick?: MouseEventHandler
  onItemClickCb?: () => void
}

export type SidebarItemProps = ItemProps & {
  label: string
  transform?: TextTransform
  navLabel?: string
  children?: SidebarItemProps[]
}

export type SidebarProps = {
  className?: string
  options?: SidebarItemProps[]
  collapsed?: boolean
  toggle?: () => void
  onNavItemClick?: () => void
}

export const itemClasses = {
  primary:
    'hover:bg-btn-primary-translucent hover:dark:bg-btn-primary-translucent !mx-1',
  secondary:
    'hover:bg-btn-secondary-translucent hover:dark:bg-btn-secondary-translucent',
}

export const iconClasses = {
  primary: 'text-light-gray-primary dark:text-dark-gray-primary',
  secondary: 'text-light-green-light dark:text-dark-green-light',
}
