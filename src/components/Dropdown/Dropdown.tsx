import { ReactNode } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { DropdownOptions } from 'components/Dropdown/types'

type Props = { children: ReactNode } & DropdownOptions

export const Dropdown = (props: Props) => {
  const { className, children, disabled, value, onChange } = props

  return (
    <Listbox
      className={classNames(
        'relative text-left inline-block self-start',
        className,
      )}
      as="div"
      disabled={disabled}
      value={value}
      onChange={onChange}
    >
      {children}
    </Listbox>
  )
}
