import { IconName } from 'components/Atomic'

export type MenuItemType = {
  label: string
  icon?: IconName
  href?: string
  onClick?: () => void
}
