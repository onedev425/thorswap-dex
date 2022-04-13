import { PropsWithChildren } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { DropdownOptions } from 'components/Atomic/Dropdown/types'

type Props = PropsWithChildren<DropdownOptions>

export const Dropdown = ({
  className,
  children,
  disabled,
  value,
  onChange,
}: Props) => {
  return (
    <Listbox
      className={classNames('z-10 relative text-left inline-block', className)}
      as="div"
      disabled={disabled}
      value={value}
      onChange={onChange}
    >
      {children}
    </Listbox>
  )
}
