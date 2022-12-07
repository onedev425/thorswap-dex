import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import classNames from 'classnames';
import { Icon, Typography } from 'components/Atomic';
import { baseHoverClass, genericBgClasses } from 'components/constants';
import { ReactNode } from 'react';

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
    <Menu>
      {({ isOpen }) => (
        <div className={classNames(className, 'w-full flex relative ')}>
          <MenuButton
            as="div"
            className={classNames(
              genericBgClasses.secondary,
              baseHoverClass,
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              'shadow-md h-10 flex dir justify-between rounded-2xl items-center px-3 !py-0 transition-all',
              { 'flex flex-1 self-stretch': stretch },
              buttonClassName,
            )}
            disabled={disabled}
          >
            <div className="flex justify-between items-center">
              {openComponent || <Typography>{openLabel || defaultOpenLabel}</Typography>}

              <Icon
                className={classNames(
                  'w-5 h-5 ml-2 -mr-1 transition-all duration-300 ease-in-out',
                  {
                    'rotate-180': isOpen,
                  },
                )}
                color="secondary"
                name="chevronDown"
                size={12}
              />
            </div>
          </MenuButton>

          <MenuList
            borderRadius={16}
            className={classNames(
              'absolute left-0 origin-top-right overflow-hidden focus:outline-none shadow-2xl min-w-full mt-[-4px]',
              'border border-solid border-light-border-primary dark:border-dark-border-primary',
              genericBgClasses.primary,
              menuClassName,
            )}
            p={0}
            rootProps={{ className: 'z-50 w-full' }}
          >
            {menuItems.map(({ value, Component, className, disabled, label }) => (
              <MenuItem
                as="div"
                bg="none"
                className={className}
                disabled={disabled}
                key={value}
                onClick={() => onChange(value)}
                p={0}
                value={value}
              >
                <div
                  className={classNames(
                    'p-2',
                    {
                      'hover:bg-light-gray-light dark:hover:bg-dark-bg-secondary w-full': !disabled,
                      'opacity-80': disabled,
                    },
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                  )}
                >
                  {Component || <Typography>{label}</Typography>}
                </div>
              </MenuItem>
            ))}
          </MenuList>
        </div>
      )}
    </Menu>
  );
};
