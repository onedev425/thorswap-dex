import { ComponentMeta } from '@storybook/react'

import { TooltipPortal } from 'components/Atomic'
import { navbarOptions } from 'components/Sidebar/data'

import { Sidebar as SidebarComp } from './Sidebar'

export default {
  title: 'Components/Sidebar',
  component: SidebarComp,
  argTypes: {},
} as ComponentMeta<typeof SidebarComp>

export const Sidebar = () => {
  return (
    <div>
      <TooltipPortal />
      <SidebarComp options={navbarOptions} />
    </div>
  )
}
