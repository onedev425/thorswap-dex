import { IconName } from 'components/Atomic'

export type SidebarVariant = 'primary' | 'secondary'

type ItemProps = {
  iconName: IconName
  href: string
  label?: string
}

export type NavItemProps = ItemProps & {
  variant?: SidebarVariant
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

export const itemClasses = {
  primary:
    'hover:bg-btn-primary-translucent hover:dark:bg-btn-primary-translucent',
  secondary:
    'hover:bg-btn-secondary-translucent hover:dark:bg-btn-secondary-translucent',
}

export const iconClasses = {
  primary: 'text-light-gray-primary dark:text-dark-gray-primary',
  secondary: 'text-light-green-light dark:text-dark-green-light',
}
