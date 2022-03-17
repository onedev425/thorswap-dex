import { Fragment } from 'react'

import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

import Logo from '../Announcement/assets/images/logo.png'
import { navbarOptions } from './data'
import { NavItem } from './NavItem'
import { SidebarProps, SidebarItemProps, Variant } from './types'

const renderMenu = (
  options: SidebarItemProps[],
  variant: Variant,
  collapsed = false,
) => {
  return (
    <ul
      key={variant}
      className={classNames(
        'flex flex-col rounded-2xl p-0 list-none',
        collapsed ? 'items-center m-0' : 'w-full',
        { 'mb-5': variant === 'secondary' },
        {
          'bg-light-green-lighter dark:.dark .dark:bg-dark-bg-secondary':
            variant === 'secondary',
        },
      )}
    >
      {options.map(({ hasSub, label, children, ...rest }: SidebarItemProps) => {
        if (hasSub && children)
          return (
            <Fragment key={label}>
              <div
                className={classNames(
                  'transition-all duration-300 overflow-hidden',
                  {
                    'scale-0 max-h-0': collapsed,
                    'scale-1 max-h-[20px]': !collapsed,
                  },
                )}
              >
                <Typography
                  className="mb-1 ml-2"
                  color="secondary"
                  variant="caption-xs"
                  fontWeight="semibold"
                  transform="uppercase"
                >
                  {label}
                </Typography>
              </div>

              {renderMenu(children, 'secondary', collapsed)}
            </Fragment>
          )

        return (
          <Fragment key={label}>
            {variant === 'primary' && (
              <div
                className={classNames(
                  'transition-all duration-300 overflow-hidden',
                  {
                    'scale-0 max-h-0': collapsed,
                    'scale-1 max-h-[20px]': !collapsed,
                  },
                )}
              >
                <Typography
                  className="ml-2"
                  color="secondary"
                  variant="caption-xs"
                  fontWeight="semibold"
                  transform="uppercase"
                >
                  {label}
                </Typography>
              </div>
            )}
            <NavItem
              key={label}
              className={classNames(
                variant === 'primary' ? 'mb-4' : 'mb-2',
                'last-of-type:mb-0',
              )}
              variant={variant}
              label={label}
              collapsed={collapsed}
              {...rest}
            />
          </Fragment>
        )
      })}
    </ul>
  )
}

export const Sidebar = ({
  className,
  options = navbarOptions,
  collapsed = false,
  toggle,
}: SidebarProps) => {
  const navigate = useNavigate()

  return (
    <nav
      className={classNames(
        'flex flex-col items-center my-4 transition-all duration-300 overflow-hidden ml-4',
        'h-sidebar',
        'rounded-3xl border-box sticky top-0 bg-light-bg-secondary dark:bg-dark-bg-secondary !bg-opacity-30',
        { 'w-[72px]': collapsed },
        { 'w-[200px]': !collapsed },
        className,
      )}
    >
      <div
        onClick={() => navigate(ROUTES.Home)}
        className="my-4 min-w-[48px] h-12 transition-colors cursor-pointer"
      >
        <img className="w-12 h-12" src={Logo} alt="Logo" />
      </div>

      <Scrollbar customStyle={{ right: '-2px' }}>
        <div className="left-2 right-2 absolute top-[10%]">
          {renderMenu(options, 'primary', collapsed)}
        </div>
      </Scrollbar>

      {!!toggle && (
        <Box
          className="p-2.5 cursor-pointer w-full border-0 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray !border-opacity-30"
          alignCenter
          justifyCenter
          onClick={toggle}
        >
          <Tooltip
            content={collapsed ? t('components.sidebar.uncollapse') : ''}
          >
            <div>
              <Icon
                className={classNames({ '-scale-x-100': collapsed })}
                name="collapse"
              />
            </div>

            {!collapsed && (
              <Typography
                className={classNames(
                  'px-3 dark:group-hover:text-white font-bold opacity-60',
                )}
                variant="caption-xs"
                transform="uppercase"
              >
                {t('components.sidebar.collapse')}
              </Typography>
            )}
          </Tooltip>
        </Box>
      )}
    </nav>
  )
}
