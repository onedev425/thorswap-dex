import { ReactNode } from 'react'

import { IconName } from 'components/Atomic'

export type MenuItemType = {
  labelClassName?: string
  desc?: string
  hasSubmenu?: boolean
  href?: string
  icon?: IconName
  iconComponent?: ReactNode
  isSelected?: boolean
  label: string
  onClick?: () => void
  status?: boolean
  value?: string
  gap?: string
}
