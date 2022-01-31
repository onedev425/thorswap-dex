import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { genericBgClasses } from 'components/constants'
import { DropdownMenuItem } from 'components/Dropdown/types'
import { Typography } from 'components/Typography'

export const MenuOption = (props: DropdownMenuItem) => {
  const { label, value, Component, disabled } = props

  return (
    <Listbox.Option as="span" value={value} disabled={disabled}>
      {({ active, selected }) => (
        <div
          className={classNames(
            'px-3 py-2',
            {
              [genericBgClasses.green]: selected,
              [genericBgClasses.secondary]: active && !selected,
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
