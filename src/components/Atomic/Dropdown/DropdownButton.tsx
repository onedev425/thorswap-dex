import { memo, ReactNode } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { Icon, Typography, Box } from 'components/Atomic'
import { baseHoverClass, genericBgClasses } from 'components/constants'

type Props = {
  className?: string
  disabled?: boolean
  label?: ReactNode | string
  stretch?: boolean
}

export const DropdownButton = memo(
  ({ className, label, disabled: buttonDisabled, stretch }: Props) => (
    <Listbox.Button
      disabled={buttonDisabled}
      className="relative p-0 bg-transparent border-none outline-none -z-1 w-full flex"
    >
      {({ open, disabled }) => (
        <Box
          className={classNames(
            genericBgClasses.secondary,
            baseHoverClass,
            disabled ? 'cursor-not-allowed' : 'cursor-pointer',
            'shadow-md h-10 inline-flex justify-between rounded-2xl items-center px-3 !py-0 transition-all',
            { 'flex flex-1 self-stretch': stretch },
            className,
          )}
        >
          {typeof label === 'string' ? <Typography>{label}</Typography> : label}

          <Icon
            className={classNames(
              'w-5 h-5 ml-2 -mr-1 transition-all duration-300 ease-in-out',
              { 'rotate-180': open },
            )}
            name="chevronDown"
            color="secondary"
            size={12}
          />
        </Box>
      )}
    </Listbox.Button>
  ),
)
