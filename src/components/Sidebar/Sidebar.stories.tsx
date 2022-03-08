import { BrowserRouter } from 'react-router-dom'

import { ComponentMeta, Story } from '@storybook/react'

import { TooltipPortal } from 'components/Atomic'
import { navbarOptions } from 'components/Sidebar/data'
import { SidebarProps } from 'components/Sidebar/types'

import { Sidebar as SidebarComp } from './Sidebar'

export default {
  title: 'Components/Sidebar',
  component: SidebarComp,
} as ComponentMeta<typeof SidebarComp>

const SidebarStory: Story<SidebarProps> = (args) => (
  <>
    <TooltipPortal />
    <BrowserRouter>
      <SidebarComp {...args} />
    </BrowserRouter>
  </>
)
export const Sidebar = SidebarStory.bind({})

Sidebar.args = {
  collapsed: false,
  options: navbarOptions,
}
