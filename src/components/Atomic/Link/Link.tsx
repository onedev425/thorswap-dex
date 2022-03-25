import { NavLink } from 'react-router-dom'

import classNames from 'classnames'

type LinkProps = {
  to: string
  children?: React.ReactNode
  className?: string
  isExternal?: boolean
  onClick?: () => void
}

export const Link = ({
  className,
  to,
  children,
  isExternal,
  onClick,
}: LinkProps) => {
  const externalHref =
    isExternal || /^((http|https|ftp):\/\/)/.test(to.trim?.())

  if (externalHref)
    return (
      <a
        className={classNames(className, 'no-underline')}
        target="_blank"
        rel="noopener noreferrer"
        href={to}
        onClick={onClick}
      >
        {children}
      </a>
    )

  return (
    <NavLink
      className={classNames(className, 'no-underline')}
      to={to}
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}
