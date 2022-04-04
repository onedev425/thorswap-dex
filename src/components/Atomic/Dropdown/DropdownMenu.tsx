import { Transition } from '@headlessui/react'

import { Dropdown } from './Dropdown'
import { DropdownButton } from './DropdownButton'
import { Menu } from './Menu'
import { MenuOption } from './MenuOption'
import { DropdownMenuItem, DropdownOptions } from './types'

type DropdownMenuProps = {
  className?: string
  menuClassName?: string
  menuItems: DropdownMenuItem[]
  openLabel?: string
  openComponent?: JSX.Element
} & DropdownOptions

export const DropdownMenu = ({
  className,
  menuClassName,
  disabled,
  openLabel,
  menuItems,
  value,
  openComponent,
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
        label={openComponent || openLabel || defaultOpenLabel}
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
        <Menu className={menuClassName}>
          {menuItems.map((option) => (
            <MenuOption
              key={option.value}
              className="hover:brightness-90 hover:dark:brightness-110"
              {...option}
            />
          ))}
        </Menu>
      </Transition>
    </Dropdown>
  )
}
