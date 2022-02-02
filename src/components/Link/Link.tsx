import { NavLink } from 'react-router-dom'

import classNames from 'classnames'

import { LinkProps } from './types'

export const Link = (props: LinkProps) => {
  const { className, to, children, isExternal } = props

  if (isExternal)
    return (
      <a
        className={classNames(className, 'no-underline')}
        target="_blank"
        rel="noopener noreferrer"
        href={to}
      >
        {children}
      </a>
    )

  return (
    <NavLink className={className} to={to}>
      {children}
    </NavLink>
  )
}
