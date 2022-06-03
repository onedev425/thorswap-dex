import { memo, MouseEventHandler, ReactNode } from 'react'

import { NavLink } from 'react-router-dom'

import classNames from 'classnames'

type LinkProps = {
  to: string
  children?: ReactNode
  className?: string
  external?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

export const Link = memo(
  ({ className, to, children, external, onClick }: LinkProps) => {
    const externalHref =
      external || /^((http|https|ftp):\/\/)/.test(to.trim?.())

    return externalHref ? (
      <a
        className={classNames(className, 'no-underline')}
        target="_blank"
        rel="noopener noreferrer"
        href={to}
        onClick={onClick}
      >
        {children}
      </a>
    ) : (
      <NavLink
        className={classNames(className, 'no-underline')}
        to={to}
        onClick={onClick}
      >
        {children}
      </NavLink>
    )
  },
)
