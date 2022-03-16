import { useLayoutEffect } from 'react'

import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'

import { Tooltip, Icon, Link, Typography } from 'components/Atomic'

import { NavItemProps } from './types'

export const itemClasses = {
  primary: 'hover:bg-btn-primary hover:dark:bg-btn-primary',
  secondary: 'hover:bg-btn-secondary hover:dark:bg-btn-secondary',
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
  const renderItem = () => {
    return (
      <div
        className={classNames(
          'h-10 box-border flex items-center justify-center rounded-2xl group transition hover:!bg-opacity-100',
          itemClasses[variant],
          {
            'bg-btn-primary dark:bg-btn-primary':
              isActive && variant === 'primary',
          },
          {
            'bg-btn-secondary dark:bg-btn-secondary':
              isActive && variant === 'secondary',
          },
          { '!bg-opacity-20': isActive },
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
              'transition dark:group-hover:stroke-white font-bold',
              iconClasses[variant],
              { 'stroke-white': isActive },
            )}
            size={18}
          />
          {!collapsed && (
            <Typography
              className={classNames(
                'px-3 dark:group-hover:text-white font-bold',
                iconClasses[variant],
                { 'text-white dark:text-white': isActive },
              )}
              transform="uppercase"
            >
              {label}
            </Typography>
          )}
        </Link>
      </div>
    )
  }

  return (
    <li className={className}>
      <Tooltip content={collapsed ? label : ''} place="right">
        {renderItem()}
      </Tooltip>
    </li>
  )
}
