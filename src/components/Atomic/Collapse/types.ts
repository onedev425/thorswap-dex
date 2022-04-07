import { ReactNode } from 'react'

import { IconName } from 'components/Atomic'

export type CollapseProps = {
  title: string | ReactNode
  children?: ReactNode
  shadow?: boolean
  className?: string
  contentClassName?: string
}

export type CollapseTitleProps = {
  iconName: IconName
  title: string
  subTitle: string
}
