import { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { Asset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'

import { useMidgard } from 'redux/midgard/hooks'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

import Logo from 'assets/images/logo.png'

import { navbarOptions } from './data'
import { SidebarItem } from './SidebarItem'
import { SidebarProps } from './types'

export const Sidebar = ({
  className,
  options = navbarOptions,
  collapsed = false,
  toggle,
}: SidebarProps) => {
  const { stats } = useMidgard()
  const navigate = useNavigate()

  const runeLabel = useMemo(
    () =>
      stats?.runePriceUSD
        ? `$${parseFloat(stats.runePriceUSD || '').toFixed(2)}`
        : '$ -',
    [stats],
  )

  return (
    <nav
      className={classNames(
        'flex flex-col items-center my-4 transition-all overflow-hidden ml-4 h-sidebar',
        'rounded-3xl border-box sticky top-0 bg-light-bg-secondary dark:bg-dark-bg-secondary md:!bg-opacity-30',
        'border-opacity-30 border border-solid border-light-typo-gray dark:border-none',
        collapsed ? 'w-[72px]' : 'w-[180px]',
        className,
      )}
    >
      <div
        onClick={() => navigate(ROUTES.Home)}
        className="my-8 min-w-[48px] h-12 transition-colors cursor-pointer"
      >
        <img className="w-12 h-12" src={Logo} alt="Logo" />
      </div>

      <div className="w-full h-sidebar-content">
        <Scrollbar height="calc(100vh - 220px)">
          <SidebarItem
            options={options}
            variant="primary"
            collapsed={collapsed}
          />
        </Scrollbar>
      </div>

      <Box
        className={classNames(
          'gap-1 transition-all',
          collapsed ? 'pb-3' : 'pb-2.5',
        )}
        center
      >
        <AssetIcon asset={Asset.RUNE()} size={collapsed ? 16 : 24} />
        <Typography
          variant={collapsed ? 'caption-xs' : 'body'}
          className="transition-[font-size]"
          fontWeight="semibold"
        >
          {runeLabel}
        </Typography>
      </Box>

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
    </nav>
  )
}
