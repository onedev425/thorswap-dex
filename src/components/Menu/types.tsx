import { IconName } from 'components/Icon'

export type MenuItemType = {
  label: string
  icon?: IconName
  href?: string
  onClick?: () => void
}
