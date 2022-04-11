import { SidebarItemProps } from 'components/Sidebar/types'

import { t } from 'services/i18n'

import { ROUTES, THORYIELD_ROUTE } from 'settings/constants'

export const navbarOptions: SidebarItemProps[] = [
  {
    iconName: 'app',
    href: ROUTES.Home,
    label: t('components.sidebar.dashboard'),
  },
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
        iconName: 'send',
        href: ROUTES.Send,
        label: t('components.sidebar.send'),
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
  // {
  //   iconName: 'tradeLightning',
  //   href: ROUTES.Stake,
  //   label: t('components.sidebar.thor'),
  //   hasSub: true,
  //   children: [
  //     {
  //       iconName: 'tradeLightning',
  //       href: ROUTES.Stake,
  //       label: t('components.sidebar.thorStake'),
  //     },
  //     {
  //       iconName: 'chartPieOutline',
  //       href: ROUTES.Vesting,
  //       label: t('components.sidebar.vesting'),
  //     },
  //   ],
  // },
  {
    iconName: 'wallet',
    href: ROUTES.Wallet,
    label: t('components.sidebar.wallet'),
  },
  // {
  //   iconName: 'cloud',
  //   href: ROUTES.Nodes,
  //   label: t('components.sidebar.thornode'),
  // },
  {
    transform: 'none',
    label: t('components.sidebar.stats'),
    navLabel: 'THORYield',
    iconName: 'external',
    href: THORYIELD_ROUTE,
  },
]
