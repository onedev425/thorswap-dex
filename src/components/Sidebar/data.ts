import { SidebarItemProps } from 'components/Sidebar/types'

import { ROUTES } from 'settings/constants'

export const navbarOptions: SidebarItemProps[] = [
  {
    iconName: 'app',
    href: ROUTES.Home,
    label: 'Dashboard',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'tradeLightning',
    href: ROUTES.Home,
    label: 'Trade',
    isExternal: false,
    hasSub: true,
    children: [
      {
        iconName: 'swap',
        href: ROUTES.Swap,
        label: 'Swap',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'inIcon',
        href: ROUTES.AddLiquidity,
        label: 'Add Liquidity',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'sputnik',
        href: ROUTES.ManageLiquidity,
        label: 'Manage Liquidity',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'lightning',
        href: ROUTES.Stake,
        label: 'Thor Stake',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'watch',
        href: ROUTES.Home,
        label: 'Pending Liquidity',
        isExternal: false,
        hasSub: false,
      },
    ],
  },
  {
    iconName: 'wallet',
    href: ROUTES.Wallet,
    label: 'Wallet',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'cloud',
    href: ROUTES.Nodes,
    label: 'Thornode',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'settings',
    href: ROUTES.Stats,
    label: 'Stats',
    isExternal: false,
    hasSub: false,
  },
]
