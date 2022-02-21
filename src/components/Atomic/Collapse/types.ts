import { IconName } from 'components/Atomic'

export type CollapseProps = {
  title: string | React.ReactNode
  children?: React.ReactNode
  shadow?: boolean
  className?: string
}

export type CollapseTitleProps = {
  iconName: IconName
  title: string
  subTitle: string
}
