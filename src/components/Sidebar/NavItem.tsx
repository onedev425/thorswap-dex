import classNames from 'classnames'

import { Tooltip, Icon, Link } from 'components/Atomic'

import { NavItemProps } from './types'

const itemClasses = {
  primary: 'hover:bg-btn-primary hover:dark:bg-btn-primary',
  secondary: 'hover:bg-light-btn-secondary hover:dark:bg-dark-btn-secondary',
}

const iconClasses = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  secondary: 'text-light-btn-secondary dark:text-dark-btn-secondary',
}

export const NavItem = ({
  className = '',
  iconName,
  href,
  isExternal = false,
  variant = 'primary',
  label,
  showTooltip = false,
}: NavItemProps) => {
  const renderItem = () => {
    return (
      <div
        className={classNames(
          'h-10 p-[5px] box-border flex items-center justify-center rounded-2xl group transition',
          itemClasses[variant],
          { 'w-10': showTooltip },
        )}
      >
        <Link
          className={classNames(
            'flex items-center w-full h-full no-underline',
            {
              'justify-center': showTooltip,
            },
          )}
          isExternal={isExternal}
          to={href}
        >
          <Icon
            name={iconName}
            className={classNames(
              'transition group-hover:stroke-white',
              iconClasses[variant],
            )}
            size={18}
          />
          {!showTooltip && <span className="px-3 text-white">{label}</span>}
        </Link>
      </div>
    )
  }
  if (showTooltip) {
    return (
      <li className={className}>
        <Tooltip content={label} place="right">
          {renderItem()}
        </Tooltip>
      </li>
    )
  }
  return <li className={className}>{renderItem()}</li>
}
