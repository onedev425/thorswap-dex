import { useState } from 'react'

import { ComponentMeta } from '@storybook/react'

import { Icon, Typography } from 'components/Atomic'

import { Dropdown, Menu, MenuOption, DropdownButton } from './'
import { DropdownMenu as DropdownMenuComponent } from './DropdownMenu'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Dropdown',
  component: DropdownMenuComponent,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
} as ComponentMeta<typeof DropdownMenuComponent>

const menuItems = [
  { label: 'USDT', value: 'USDT' },
  { label: 'RUNE', value: 'RUNE' },
  { label: 'BTC', value: 'BTC' },
  { label: 'ETH', value: 'ETH' },
]

const menuItemsComponents = [
  { label: 'USDT', value: 'USDT' },
  { label: 'RUNE', value: 'RUNE' },
  { Component: <Icon name="bitcoin" />, value: 'BTC' },
  { Component: <Icon name="ethereum" />, value: 'ETH' },
]

export const DropdownMenu = () => {
  const [value, setValue] = useState('BTC')
  return (
    <div className="flex flex-row flex-wrap gap-3 p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <div>
        <Typography>Default</Typography>
        <DropdownMenuComponent
          menuItems={menuItems}
          value={value}
          onChange={setValue}
        />
      </div>

      <div>
        <Typography>Disabled</Typography>
        <DropdownMenuComponent
          disabled
          menuItems={menuItems}
          value={value}
          onChange={(v) => setValue(v)}
        />
      </div>

      <div>
        <Typography>Custom open label</Typography>
        <DropdownMenuComponent
          menuItems={menuItems}
          value={value}
          onChange={(v) => setValue(v)}
          openLabel="Open dropdown"
        />
      </div>

      <div>
        <Typography>Custom option component</Typography>
        <DropdownMenuComponent
          menuItems={menuItemsComponents}
          value={value}
          onChange={(v) => setValue(v)}
          openLabel="Open dropdown"
        />
      </div>

      <div>
        <Typography>Custom button component</Typography>
        <DropdownMenuComponent
          menuItems={menuItemsComponents}
          value={value}
          onChange={(v) => setValue(v)}
          OpenComponent={<Icon name="lightning" />}
        />
      </div>
    </div>
  )
}

export const CustomDropdown = () => {
  const [value, setValue] = useState('BTC')
  return (
    <div className="flex flex-col flex-wrap gap-3 p-4 bg-light-bg-primary dark:bg-dark-bg-primary">
      <Typography>Dropdown assembled from atomic parts</Typography>

      <Dropdown value={value} onChange={setValue}>
        <DropdownButton label="Custom dropdown" />
        <Menu>
          <MenuOption label="BTC" value="BTC" />
          <MenuOption label="ETH" value="ETH" disabled />
          <MenuOption
            Component={
              <div className="flex flex-row gap-2">
                <Icon name="lightning" />
                <Typography>Rune</Typography>
              </div>
            }
            value="RUNE"
          />
        </Menu>
      </Dropdown>
    </div>
  )
}
