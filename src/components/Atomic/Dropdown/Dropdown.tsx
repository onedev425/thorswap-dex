import { ReactNode } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { DropdownOptions } from 'components/Atomic/Dropdown/types'

type Props = { children: ReactNode } & DropdownOptions

export const Dropdown = (props: Props) => {
  const { className, children, disabled, value, onChange } = props

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
