import { useLayoutEffect } from 'react'

import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'

import { Box, Icon, Link, Tooltip, Typography } from 'components/Atomic'

import { NavItemProps, iconClasses, itemClasses } from './types'

export const NavItem = ({
  className = '',
  iconName,
  href,
  isExternal = false,
  variant = 'primary',
  label,
  collapsed = false,
}: NavItemProps) => {
  useLayoutEffect(() => {
    if (collapsed) {
      setTimeout(ReactTooltip.rebuild, 0)
    }
  }, [collapsed])

  const isActive = window.location.pathname === href

  return (
    <li className={className}>
      <Tooltip content={collapsed ? label : ''} place="right">
        <Box
          className={classNames(
            'h-10 box-border rounded-2xl group transition',
            itemClasses[variant],
            {
              'bg-btn-primary dark:bg-btn-primary':
                isActive && variant === 'primary',
              'bg-btn-secondary dark:bg-btn-secondary':
                isActive && variant === 'secondary',
            },
          )}
          center
        >
          <Link
            className={classNames(
              'flex items-center w-full h-full no-underline px-2.5 py-2 ',
            )}
            isExternal={isExternal}
            to={href}
          >
            <Icon
              name={iconName}
              className={classNames(
                'transition group-hover:stroke-white font-bold',
                iconClasses[variant],
                { 'stroke-white': isActive },
              )}
              size={18}
            />
            {!collapsed && (
              <Typography
                className={classNames(
                  'px-2 group-hover:text-white',
                  isActive
                    ? 'text-white dark:text-white'
                    : iconClasses[variant],
                )}
                variant="caption"
                fontWeight="semibold"
                transform="uppercase"
              >
                {label}
              </Typography>
            )}
          </Link>
        </Box>
      </Tooltip>
    </li>
  )
}
