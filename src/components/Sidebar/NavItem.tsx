import { memo, MouseEventHandler, useCallback, useLayoutEffect } from 'react'

import { useLocation } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'

import classNames from 'classnames'

import { Box, Icon, Link, Tooltip, Typography } from 'components/Atomic'

import { NavItemProps, iconClasses, itemClasses } from './types'

export const NavItem = memo(
  ({
    className = '',
    iconName,
    href = '',
    variant = 'primary',
    label,
    collapsed = false,
    transform = 'uppercase',
    rightIconName,
    onClick,
    onItemClickCb,
  }: NavItemProps) => {
    useLayoutEffect(() => {
      if (collapsed) {
        setTimeout(ReactTooltip.rebuild, 0)
      }
    }, [collapsed])

    const isActive = useLocation().pathname.includes(href)

    const onClickHandler: MouseEventHandler = useCallback(
      (e) => {
        onClick?.(e)
        onItemClickCb?.()
      },
      [onClick, onItemClickCb],
    )

    return (
      <li className={className}>
        <Tooltip content={label} disabled={!collapsed} place="right">
          <Box
            className={classNames(
              'w-full h-9 box-border rounded-2xl group transition-all',
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
              className="flex items-center w-full h-full py-2 no-underline justify-center"
              to={href}
              onClick={onClickHandler}
            >
              <Box className="justify-center w-full px-4">
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
                    transform={transform}
                  >
                    {label}
                  </Typography>
                  {rightIconName && (
                    <Icon
                      className={classNames(
                        'ml-auto transition group-hover:stroke-white group-hover:text-white font-bold',
                        iconClasses[variant],
                        { 'stroke-white !text-white': isActive },
                      )}
                      name={rightIconName}
                      size={18}
                    />
                  )}
                </Box>
              </Box>
            </Link>
          </Box>
        </Tooltip>
      </li>
    )
  },
)
