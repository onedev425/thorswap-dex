import { SidebarItemProps } from 'components/Sidebar/types'

import { t } from 'services/i18n'

import {
  ROUTES,
  THORYIELD_STATS_ROUTE,
  THOR_STAKING_V1_ROUTE,
} from 'settings/constants'

export const getDefaultNavbarOptions = (): SidebarItemProps[] => [
  {
    iconName: 'tradeLightning',
    href: ROUTES.Swap,
    label: t('components.sidebar.trade'),
    children: [
      {
        iconName: 'swap',
        href: ROUTES.Swap,
        label: t('components.sidebar.swap'),
      },
      {
        iconName: 'inIcon',
        href: ROUTES.AddLiquidity,
        label: t('components.sidebar.addLiquidity'),
      },
      {
        iconName: 'sputnik',
        href: ROUTES.ManageLiquidity,
        label: t('components.sidebar.manageLiquidity'),
      },
    ],
  },
  {
    iconName: 'wallet',
    href: ROUTES.Wallet,
    label: t('components.sidebar.wallet'),
    children: [
      {
        iconName: 'wallet',
        href: ROUTES.Wallet,
        label: t('components.sidebar.wallet'),
      },
      {
        iconName: 'send',
        href: ROUTES.Send,
        label: t('components.sidebar.send'),
      },
    ],
  },
  // {
  //   iconName: 'cloud',
  //   href: ROUTES.Nodes,
  //   label: t('components.sidebar.thornode'),
  // },
  {
    iconName: 'settings',
    href: ROUTES.Stats,
    label: t('components.sidebar.stats'),
    children: [
      {
        iconName: 'app',
        href: ROUTES.Home,
        label: t('components.sidebar.dashboard'),
      },
      {
        transform: 'none',
        label: t('components.sidebar.stats'),
        navLabel: t('components.sidebar.thoryield'),
        iconName: 'thoryield',
        rightIconName: 'external',
        href: THORYIELD_STATS_ROUTE,
      },
    ],
  },
  {
    iconName: 'tradeLightning',
    href: ROUTES.Stake,
    label: t('components.sidebar.thor'),
    children: [
      {
        iconName: 'tradeLightning',
        href: THOR_STAKING_V1_ROUTE,
        label: t('components.sidebar.thorStake'),
        rightIconName: 'external',
      },
      // {
      //   iconName: 'chartPieOutline',
      //   href: ROUTES.Vesting,
      //   label: t('components.sidebar.vesting'),
      // },
    ],
  },
]
