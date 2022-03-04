import { SidebarItemProps } from 'components/Sidebar/types'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const navbarOptions: SidebarItemProps[] = [
  {
    iconName: 'app',
    href: ROUTES.Home,
    label: t('components.sidebar.dashboard'),
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'tradeLightning',
    href: ROUTES.Home,
    label: t('components.sidebar.trade'),
    isExternal: false,
    hasSub: true,
    children: [
      {
        iconName: 'swap',
        href: ROUTES.Swap,
        label: t('components.sidebar.swap'),
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'inIcon',
        href: ROUTES.AddLiquidity,
        label: t('components.sidebar.addLiquidity'),
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'sputnik',
        href: ROUTES.ManageLiquidity,
        label: t('components.sidebar.manageLiquidity'),
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'lightning',
        href: ROUTES.Stake,
        label: t('components.sidebar.thorStake'),
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'watch',
        href: ROUTES.Home,
        label: t('components.sidebar.pendingLiquidity'),
        isExternal: false,
        hasSub: false,
      },
    ],
  },
  {
    iconName: 'chartPie',
    href: ROUTES.Vesting,
    label: t('components.sidebar.vesting'),
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'wallet',
    href: ROUTES.Wallet,
    label: t('components.sidebar.wallet'),
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'cloud',
    href: ROUTES.Nodes,
    label: t('components.sidebar.thornode'),
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'settings',
    href: ROUTES.Stats,
    label: t('components.sidebar.stats'),
    isExternal: false,
    hasSub: false,
  },
]
