import { memo, MouseEventHandler } from 'react'

import classNames from 'classnames'

import {
  Box,
  Icon,
  IconColor,
  IconName,
  Link,
  Tooltip,
} from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

type Props = {
  className?: string
  tooltip?: string
  size?: number
  spin?: boolean
  iconName: IconName
  color?: IconColor
  onClick?: (() => void) | MouseEventHandler
  href?: string
  iconHoverHighlight?: boolean
}

export const HoverIcon = memo(({ href, ...props }: Props) => {
  if (!href) return <IconComponent {...props} />

  return (
    <Link to={href}>
      <IconComponent {...props} />
    </Link>
  )
})

const IconComponent = memo(
  ({
    tooltip,
    className,
    iconName,
    color = 'secondary',
    size = 16,
    spin = false,
    onClick,
    iconHoverHighlight = true,
  }: Props) => (
    <Tooltip content={tooltip}>
      <Box className={classNames(baseHoverClass, 'group')}>
        <Icon
          className={classNames(
            {
              'group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary':
                iconHoverHighlight,
            },
            className,
          )}
          name={iconName}
          color={color}
          size={size}
          spin={spin}
          onClick={onClick}
        />
      </Box>
    </Tooltip>
  ),
)
