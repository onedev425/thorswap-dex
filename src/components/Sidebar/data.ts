import { SidebarItemProps } from 'components/Sidebar/types'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const navbarOptions: SidebarItemProps[] = [
  {
    iconName: 'app',
    href: ROUTES.Home,
    label: t('components.sidebar.dashboard'),
    hasSub: false,
  },
  {
    iconName: 'tradeLightning',
    href: ROUTES.Swap,
    label: t('components.sidebar.trade'),
    hasSub: true,
    children: [
      {
        iconName: 'swap',
        href: ROUTES.Swap,
        label: t('components.sidebar.swap'),
        hasSub: false,
      },
      {
        iconName: 'send',
        href: ROUTES.Send,
        label: t('components.sidebar.send'),
        hasSub: false,
      },
      {
        iconName: 'inIcon',
        href: ROUTES.AddLiquidity,
        label: t('components.sidebar.addLiquidity'),
        hasSub: false,
      },
      {
        iconName: 'sputnik',
        href: ROUTES.ManageLiquidity,
        label: t('components.sidebar.manageLiquidity'),
        hasSub: false,
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
  //       hasSub: false,
  //     },
  //     {
  //       iconName: 'chartPieOutline',
  //       href: ROUTES.Vesting,
  //       label: t('components.sidebar.vesting'),
  //       hasSub: false,
  //     },
  //   ],
  // },
  {
    iconName: 'wallet',
    href: ROUTES.Wallet,
    label: t('components.sidebar.wallet'),
    hasSub: false,
  },
  // {
  //   iconName: 'cloud',
  //   href: ROUTES.Nodes,
  //   label: t('components.sidebar.thornode'),
  //   hasSub: false,
  // },
  {
    iconName: 'settings',
    href: ROUTES.Stats,
    label: t('components.sidebar.stats'),
    hasSub: false,
  },
]
