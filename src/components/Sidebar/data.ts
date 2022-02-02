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
    iconName: 'list',
    href: '/',
    label: 'app',
    isExternal: false,
    hasSub: true,
    children: [
      {
        iconName: 'tradeLightning',
        href: 'https://thorswap.finance/',
        label: 'Trade',
        isExternal: true,
        hasSub: false,
      },
      {
        iconName: 'swap',
        href: '/',
        label: 'Swap',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'inIcon',
        href: '/',
        label: 'Add Liquidity',
        isExternal: false,
        hasSub: false,
      },
      {
        iconName: 'sputnik',
        href: '/',
        label: 'Manage Liquidity',
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
    href: '/',
    label: 'Wallet',
    isExternal: false,
    hasSub: false,
  },
  {
    iconName: 'cloud',
    href: 'https://google.com',
    label: 'Thornode',
    isExternal: true,
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
