import { memo } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { Icon, Typography } from 'components/Atomic'
import { baseHoverClass, genericBgClasses } from 'components/constants'

type Props = {
  disabled?: boolean
  label?: JSX.Element | string
}

export const DropdownButton = memo(
  ({ label, disabled: buttonDisabled }: Props) => {
    return (
      <Listbox.Button
        disabled={buttonDisabled}
        className="relative p-0 bg-transparent border-none outline-none -z-1"
      >
        {({ open, disabled }) => (
          <div
            className={classNames(
              genericBgClasses.secondary,
              baseHoverClass,
              disabled ? 'cursor-not-allowed' : 'cursor-pointer',
              'shadow-md h-10 inline-flex justify-between rounded-2xl items-center px-3 !py-0 transition-all',
            )}
          >
            {typeof label === 'string' ? (
              <Typography>{label}</Typography>
            ) : (
              label
            )}

            <Icon
              className={classNames(
                'w-5 h-5 ml-2 -mr-1 transition-all duration-300 ease-in-out',
                { 'rotate-180': open },
              )}
              name="chevronDown"
              color="secondary"
              size={12}
            />
          </div>
        )}
      </Listbox.Button>
    )
  },
)
