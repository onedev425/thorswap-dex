import { useLayoutEffect } from 'react'

import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'

import { Tooltip, Icon, Link, Typography } from 'components/Atomic'

import { NavItemProps } from './types'

export const itemClasses = {
  primary:
    'hover:bg-btn-primary-translucent hover:dark:bg-btn-primary-translucent',
  secondary:
    'hover:bg-btn-secondary-translucent hover:dark:bg-btn-secondary-translucent',
}

export const iconClasses = {
  primary: 'text-light-gray-primary dark:text-dark-gray-primary',
  secondary: 'text-light-green-light dark:text-dark-green-light',
}

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
        <div
          className={classNames(
            'h-10 box-border flex items-center justify-center rounded-2xl group transition',
            itemClasses[variant],
            {
              'bg-btn-primary dark:bg-btn-primary':
                isActive && variant === 'primary',
              'bg-btn-secondary dark:bg-btn-secondary':
                isActive && variant === 'secondary',
            },
          )}
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
                  iconClasses[variant],
                  { 'text-white dark:text-white': isActive },
                )}
                variant="caption"
                fontWeight="semibold"
                transform="uppercase"
              >
                {label}
              </Typography>
            )}
          </Link>
        </div>
      </Tooltip>
    </li>
  )
}
