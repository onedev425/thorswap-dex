import { ReactNode } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { genericBgClasses } from 'components/constants'

type Props = { className?: string; children: ReactNode }

export const Menu = ({ className, children }: Props) => {
  return (
    <Listbox.Options
      className={classNames(
        'absolute left-0 origin-top-right rounded-b-2xl overflow-hidden focus:outline-none shadow-2xl min-w-full',
        genericBgClasses.primary,
        className,
      )}
      as="div"
    >
      {children}
    </Listbox.Options>
  )
}
