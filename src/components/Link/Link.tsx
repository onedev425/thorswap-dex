import { NavLink } from 'react-router-dom'

import classNames from 'classnames'

import { LinkProps } from './types'

export const Link = ({ className, to, children, isExternal }: LinkProps) => {
  const externalHref =
    isExternal || /^((http|https|ftp):\/\/)/.test(to.trim?.())

  if (externalHref)
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
