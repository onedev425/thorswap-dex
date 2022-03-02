import { ReactNode } from 'react'

import { Listbox } from '@headlessui/react'
import classNames from 'classnames'

import { genericBgClasses } from 'components/constants'

type Props = { children: ReactNode }

export const Menu = (props: Props) => {
  const { children } = props
  return (
    <Listbox.Options
      className={classNames(
        'absolute left-0 origin-top-right rounded-b-2xl overflow-hidden focus:outline-none shadow-2xl min-w-full',
        genericBgClasses.primary,
      )}
      as="div"
    >
      {children}
    </Listbox.Options>
  )
}
