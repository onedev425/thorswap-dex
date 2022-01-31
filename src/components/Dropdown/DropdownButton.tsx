import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { genericBgClasses } from 'components/constants'
import { Icon } from 'components/Icon'
import { Typography } from 'components/Typography'

type Props = {
  label?: string
  Component?: JSX.Element
  disabled?: boolean
}

export const DropdownButton = (props: Props) => {
  const { label, Component } = props

  return (
    <Listbox.Button className="outline-none border-none bg-transparent relative p-0">
      {({ open, disabled }) => {
        return (
          <div
            className={classNames(
              genericBgClasses.primary,
              {
                'rounded-b-none': open,
                'hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary':
                  !disabled,
              },
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              'inline-flex justify-between rounded items-center px-3 py-2',
            )}
          >
            {Component ? Component : <Typography>{label}</Typography>}
            <Icon
              className={classNames('w-5 h-5 ml-2 -mr-1 transition', {
                'rotate-180': open,
              })}
              name="chevronDown"
              color="secondary"
              size={12}
            />
          </div>
        )
      }}
    </Listbox.Button>
  )
}
