import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { Typography } from 'components/Atomic'
import { DropdownMenuItem } from 'components/Atomic/Dropdown/types'
import { genericBgClasses } from 'components/constants'

export const MenuOption = (props: DropdownMenuItem) => {
  const { label, value, Component, disabled } = props

  return (
    <Listbox.Option as="span" value={value} disabled={disabled}>
      {({ active, selected }) => (
        <div
          className={classNames(
            'p-2',
            {
              [genericBgClasses.green]: selected,
              [genericBgClasses.secondary]: active && !selected,
              'hover:bg-light-gray-light dark:hover:bg-dark-bg-secondary':
                !disabled,
              'opacity-80': disabled,
            },
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {Component ? Component : <Typography>{label}</Typography>}
        </div>
      )}
    </Listbox.Option>
  )
}
