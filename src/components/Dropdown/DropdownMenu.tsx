import { Transition } from '@headlessui/react'

import { DropdownButton } from 'components/Dropdown'
import { Menu } from 'components/Dropdown/Menu'
import { MenuOption } from 'components/Dropdown/MenuOption'
import { DropdownMenuProps } from 'components/Dropdown/types'

import { Dropdown } from './Dropdown'

export const DropdownMenu = (props: DropdownMenuProps) => {
  const {
    className,
    disabled,
    openLabel,
    menuItems,
    value,
    OpenComponent,
    onChange,
  } = props

  const defaultOpenLabel =
    menuItems.find((i) => i.value === value)?.label || '-'

  return (
    <Dropdown
      className={className}
      value={value}
      disabled={disabled}
      onChange={onChange}
    >
      <DropdownButton
        label={openLabel || defaultOpenLabel}
        Component={OpenComponent}
        disabled={disabled}
      />
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-y-50 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-y-90 opacity-0"
      >
        <Menu>
          {menuItems.map((option) => (
            <MenuOption {...option} key={option.value} />
          ))}
        </Menu>
      </Transition>
    </Dropdown>
  )
}
