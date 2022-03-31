import { MouseEventHandler } from 'react'

import classNames from 'classnames'

import { Icon, IconColor, IconName, Link, Tooltip } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

type Props = {
  className?: string
  tooltip?: string
  size?: number
  iconName: IconName
  color?: IconColor
  onClick?: (() => void) | MouseEventHandler
  href?: string
}

export const HoverIcon = ({ href, ...props }: Props) => {
  if (href) {
    return (
      <Link to={href}>
        <IconComponent {...props} />
      </Link>
    )
  }
  return <IconComponent {...props} />
}

const IconComponent = ({
  tooltip,
  className,
  iconName,
  color = 'secondary',
  size = 16,
  onClick,
}: Props) => (
  <Tooltip content={tooltip}>
    <Icon
      className={classNames(baseHoverClass, className)}
      name={iconName}
      color={color}
      size={size}
      onClick={onClick}
    />
  </Tooltip>
)
