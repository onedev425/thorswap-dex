import { Transition } from '@headlessui/react'

import { DropdownButton } from 'components/Atomic/Dropdown'
import { Menu } from 'components/Atomic/Dropdown/Menu'
import { MenuOption } from 'components/Atomic/Dropdown/MenuOption'
import { DropdownMenuProps } from 'components/Atomic/Dropdown/types'

import { Dropdown } from './Dropdown'

export const DropdownMenu = ({
  className,
  disabled,
  openLabel,
  menuItems,
  value,
  OpenComponent,
  onChange,
}: DropdownMenuProps) => {
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
