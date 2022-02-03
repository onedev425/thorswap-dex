import { IconName } from 'components/Icon'

export type CollapseProps = {
  title: string | React.ReactNode
  children?: React.ReactNode
}

export type CollapseTitleProps = {
  iconName: IconName
  title: string
  subTitle: string
}
