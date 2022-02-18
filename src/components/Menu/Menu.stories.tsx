import { ComponentMeta } from '@storybook/react'

import { MenuItemType } from 'components/Menu/types'

import { Menu as MenuComponent } from './Menu'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Menu',
  component: MenuComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof MenuComponent>

const menuItems = [
  { label: 'Item 1', icon: 'lightning' },
  { label: 'Item With Icon 2', icon: 'ledger' },
  { label: 'Language' },
  { label: 'Theme', href: 'http://www.example.com' },
] as MenuItemType[]

export const Default = () => {
  return (
    <div className="flex flex-row flex-wrap gap-3 p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <MenuComponent items={menuItems} stickToSide="left" />
    </div>
  )
}
