import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { Icon, Typography } from 'components/Atomic'
import { baseHoverClass, genericBgClasses } from 'components/constants'

type Props = {
  label?: string
  component?: JSX.Element
  disabled?: boolean
}

export const DropdownButton = (props: Props) => {
  const { label, component } = props

  return (
    <Listbox.Button className="relative p-0 bg-transparent border-none outline-none -z-1">
      {({ open, disabled }) => {
        return (
          <div
            className={classNames(
              genericBgClasses.primary,
              baseHoverClass,
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              'h-10 inline-flex justify-between rounded-2xl items-center px-3 !py-0 transition-all',
            )}
          >
            {component ? component : <Typography>{label}</Typography>}
            <Icon
              className={classNames(
                'w-5 h-5 ml-2 -mr-1 transition-all duration-300 ease-in-out',
                {
                  'rotate-180': open,
                },
              )}
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
