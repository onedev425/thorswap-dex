import classNames from 'classnames'

import { LinkProps } from './types'

export const Link = (props: LinkProps) => {
  const { to, children, className } = props

  return (
    <a href={to} className={classNames(className, 'no-underline')}>
      {children}
    </a>
  )
}
