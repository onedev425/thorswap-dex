import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'
import { V1_URL } from 'config/constants'

import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { SupportModal } from 'components/Modals/Support/Support'
import { Scrollbar } from 'components/Scrollbar'
import { NavItem } from 'components/Sidebar/NavItem'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

import Logo from 'assets/images/logo.png'

import { getDefaultNavbarOptions } from './data'
import { SidebarItem } from './SidebarItem'
import { SidebarProps } from './types'

const noScrollHeight = 225
const toggleHeight = 50

export const Sidebar = ({
  className,
  collapsed = false,
  toggle,
  onNavItemClick,
}: SidebarProps) => {
  const sidebarOptions = getDefaultNavbarOptions()
  const { isMdActive } = useWindowSize()
  const navigate = useNavigate()
  const [isSupportModalOpened, setIsSupportModalOpened] = useState(false)

  const scrollbarHeight = `calc(100vh - ${
    toggle ? noScrollHeight + toggleHeight : noScrollHeight
  }px)`

  return (
    <nav
      className={classNames(
        'flex flex-col items-center my-2 transition-all overflow-hidden ml-2',
        'rounded-3xl border-box sticky top-0 bg-white dark:bg-dark-bg-secondary md:dark:!bg-opacity-30',
        'shadow-md border-opacity-30 border border-solid border-light-typo-gray dark:border-none',
        collapsed ? 'w-[72px]' : 'w-[180px]',
        className,
        isMdActive ? 'h-sidebar' : 'h-[80vh]',
      )}
    >
      <div
        onClick={() => navigate(ROUTES.Home)}
        className="my-8 min-w-[48px] h-12 transition-colors cursor-pointer"
      >
        <div
          className={classNames(
            'rounded-full bg-cyan bg-opacity-30 absolute w-16 h-16 transition-all -translate-x-2 -translate-y-2 blur-[30px] dark:blur-md -z-10',
            { '!blur-[40px]': collapsed },
          )}
        />
        <img className="w-12 h-12" src={Logo} alt="Logo" />
      </div>

      <div className="w-full h-sidebar-content">
        <Scrollbar height={isMdActive ? scrollbarHeight : '50vh'}>
          <SidebarItem
            options={sidebarOptions}
            variant="primary"
            collapsed={collapsed}
            onItemClick={onNavItemClick}
          />
        </Scrollbar>
      </div>

      <ul className="flex flex-col w-full p-0 my-1 list-none rounded-2xl">
        <NavItem
          href={V1_URL}
          iconName="external"
          className={classNames('!mx-1')}
          label={t('components.sidebar.V1App')}
          collapsed={collapsed}
          onItemClickCb={onNavItemClick}
        />
        <NavItem
          href="/"
          iconName="infoCircle"
          className={classNames('!mx-1')}
          label={t('common.support')}
          collapsed={collapsed}
          onClick={(e) => {
            e.preventDefault()
            setIsSupportModalOpened(true)
          }}
          onItemClickCb={onNavItemClick}
        />
      </ul>

      {!!toggle && (
        <Box
          className="p-2.5 cursor-pointer w-full border-0 border-t border-solid border-light-typo-gray dark:border-dark-typo-gray !border-opacity-30"
          center
          onClick={toggle}
        >
          <Tooltip
            content={t('components.sidebar.expand')}
            disabled={!collapsed}
          >
            <div>
              <Icon
                className={classNames({ '-scale-x-100': collapsed })}
                name="collapse"
              />
            </div>

            <Box
              className={classNames(
                'overflow-hidden transition-all',
                collapsed ? 'w-[0%]' : 'w-full',
              )}
            >
              <Typography
                className={classNames(
                  'px-3 dark:group-hover:text-white font-bold opacity-60',
                )}
                variant="caption-xs"
                transform="uppercase"
              >
                {t('components.sidebar.collapse')}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      )}

      <SupportModal
        isOpen={isSupportModalOpened}
        onCancel={() => setIsSupportModalOpened(false)}
      />
    </nav>
  )
}
