import { useLayoutEffect } from 'react'

import { useLocation } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'

import { Box, Icon, Link, Tooltip, Typography } from 'components/Atomic'

import { NavItemProps, iconClasses, itemClasses } from './types'

export const NavItem = ({
  className = '',
  iconName,
  href,
  variant = 'primary',
  label,
  collapsed = false,
}: NavItemProps) => {
  const location = useLocation()
  useLayoutEffect(() => {
    if (collapsed) {
      setTimeout(ReactTooltip.rebuild, 0)
    }
  }, [collapsed])

  const isActive = location.pathname === href

  return (
    <li className={className}>
      <Tooltip content={label} disabled={!collapsed} place="right">
        <Box
          className={classNames(
            'w-full h-10 box-border rounded-2xl group transition-all',
            itemClasses[variant],
            {
              'items-center': collapsed,
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
              'flex items-center w-full h-full no-underline py-2 ',
            )}
            to={href}
          >
            <Box className={classNames('px-4 justify-center')}>
              <div className="min-w-[18px] min-h-[18px]">
                <Box center>
                  <Icon
                    name={iconName}
                    className={classNames(
                      'transition group-hover:stroke-white group-hover:text-white font-bold',
                      iconClasses[variant],
                      { 'stroke-white !text-white': isActive },
                    )}
                    size={18}
                  />
                </Box>
              </div>

              <Box
                className={classNames(
                  'overflow-hidden transition-all',
                  collapsed ? 'w-[0%]' : 'w-full',
                )}
              >
                <Typography
                  className={classNames(
                    'px-2 group-hover:text-white transition-all whitespace-nowrap',
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
              </Box>
            </Box>
          </Link>
        </Box>
      </Tooltip>
    </li>
  )
}
