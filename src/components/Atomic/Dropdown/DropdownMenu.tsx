import { Transition } from '@headlessui/react';
import { ReactNode } from 'react';

import { Dropdown } from './Dropdown';
import { DropdownButton } from './DropdownButton';
import { Menu } from './Menu';
import { MenuOption } from './MenuOption';
import { DropdownMenuItem, DropdownOptions } from './types';

type DropdownMenuProps = {
  buttonClassName?: string;
  className?: string;
  menuClassName?: string;
  menuItems: DropdownMenuItem[];
  openComponent?: ReactNode;
  openLabel?: string;
  stretch?: boolean;
} & DropdownOptions;

export const DropdownMenu = ({
  buttonClassName,
  className,
  disabled,
  menuClassName,
  menuItems,
  onChange,
  openComponent,
  openLabel,
  value,
  stretch,
}: DropdownMenuProps) => {
  const defaultOpenLabel = menuItems.find((i) => i.value === value)?.label || '-';

  return (
    <Dropdown className={className} disabled={disabled} onChange={onChange} value={value}>
      <DropdownButton
        className={buttonClassName}
        disabled={disabled}
        label={openComponent || openLabel || defaultOpenLabel}
        stretch={stretch}
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
              className="hover:brightness-90 hover:dark:brightness-110"
              key={option.value}
              {...option}
            />
          ))}
        </Menu>
      </Transition>
    </Dropdown>
  );
};
