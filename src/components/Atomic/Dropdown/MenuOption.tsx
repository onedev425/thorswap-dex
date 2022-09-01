import { Listbox } from '@headlessui/react';
import classNames from 'classnames';
import { Typography } from 'components/Atomic';
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types';
import { genericBgClasses } from 'components/constants';
import { memo } from 'react';

export const MenuOption = memo(
  ({ className, label, value, Component, disabled }: DropdownMenuItem) => {
    return (
      <Listbox.Option as="div" className={className} disabled={disabled} value={value}>
        {({ active, selected }) => (
          <div
            className={classNames(
              'p-2',
              {
                [genericBgClasses.green]: selected,
                [genericBgClasses.secondary]: active && !selected,
                'hover:bg-light-gray-light dark:hover:bg-dark-bg-secondary': !disabled,
                'opacity-80': disabled,
                'bg-opacity-60': selected,
              },
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            )}
          >
            {Component || <Typography>{label}</Typography>}
          </div>
        )}
      </Listbox.Option>
    );
  },
);
