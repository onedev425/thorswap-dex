import { ReactNode } from 'react'

import { IconName } from 'components/Atomic'

export type MenuItemType = {
  label: string
  desc?: string
  icon?: IconName
  iconComponent?: ReactNode
  href?: string
  onClick?: () => void
  hasSubmenu?: boolean
  isSelected?: boolean
  value?: string
}
