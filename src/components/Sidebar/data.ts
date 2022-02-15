import { SidebarItemProps } from 'components/Sidebar/types'

export const navbarOptions: SidebarItemProps[] = [
  {
    iconName: 'app',
    href: '/',
    label: 'Dashboard',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'tradeLightning',
    href: '/',
    label: 'Trade',
    isExternal: false,
    hasSub: true,
    children: [
      {
        iconName: 'swap',
        href: '/swap',
        label: 'Swap',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'inIcon',
        href: '/add-liquidity',
        label: 'Add Liquidity',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'sputnik',
        href: '/manage-liquidity',
        label: 'Manage Liquidity',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'lightning',
        href: '/stake',
        label: 'Thor Stake',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'watch',
        href: '/',
        label: 'Pending Liquidity',
        isExternal: false,
        hasSub: false,
      },
    ],
  },
  {
    iconName: 'wallet',
    href: '/wallet',
    label: 'Wallet',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'cloud',
    href: '/nodes',
    label: 'Thornode',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'settings',
    href: '/stats',
    label: 'Stats',
    isExternal: false,
    hasSub: false,
  },
]
