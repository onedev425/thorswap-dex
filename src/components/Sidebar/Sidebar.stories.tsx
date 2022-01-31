import { ComponentMeta } from '@storybook/react'

import { Sidebar as SidebarComp } from './Sidebar'
import { SidebarItemProps } from './types'

export default {
  title: 'Components/Sidebar',
  component: SidebarComp,
  argTypes: {},
} as ComponentMeta<typeof SidebarComp>

export const Sidebar = () => {
  const props: SidebarItemProps[] = [
    {
      iconName: 'app',
      href: '/',
      label: 'app',
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
          label: 'tradeLightning',
          isExternal: true,
          hasSub: false,
        },
        {
          iconName: 'swap',
          href: '/',
          label: 'swap',
          isExternal: false,
          hasSub: false,
        },
        {
          iconName: 'inIcon',
          href: '/',
          label: 'inIcon',
          isExternal: false,
          hasSub: false,
        },
        {
          iconName: 'sputnik',
          href: '/',
          label: 'sputnik',
          isExternal: false,
          hasSub: false,
        },
        {
          iconName: 'watch',
          href: '/',
          label: 'watch',
          isExternal: false,
          hasSub: false,
        },
      ],
    },
    {
      iconName: 'wallet',
      href: '/',
      label: 'wallet',
      isExternal: false,
      hasSub: false,
    },
    {
      iconName: 'cloud',
      href: '/',
      label: 'cloud',
      isExternal: false,
      hasSub: false,
    },
    {
      iconName: 'settings',
      href: '/',
      label: 'settings',
      isExternal: false,
      hasSub: false,
    },
  ]

  return <SidebarComp options={props} />
}

export const SidebarWithoutSecondary = () => {
  const props: SidebarItemProps[] = [
    {
      iconName: 'app',
      href: '/',
      label: 'app',
      isExternal: false,
      hasSub: false,
    },
    {
      iconName: 'list',
      href: '/',
      label: 'app',
      isExternal: false,
      hasSub: false,
    },
    {
      iconName: 'wallet',
      href: '/',
      label: 'wallet',
      isExternal: false,
      hasSub: false,
    },
    {
      iconName: 'cloud',
      href: '/',
      label: 'cloud',
      isExternal: false,
      hasSub: false,
    },
    {
      iconName: 'settings',
      href: '/',
      label: 'settings',
      isExternal: false,
      hasSub: false,
    },
  ]

  return <SidebarComp options={props} />
}
