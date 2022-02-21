import classNames from 'classnames'

import { Link } from 'components/Link'
import { Tooltip } from 'components/Tooltip'

import { Icon } from '../Icon'
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
  tooltip,
}: NavItemProps) => {
  return (
    <li className={className}>
      <Tooltip content={tooltip} place="right">
        <div
          className={classNames(
            'w-10 h-10 p-[5px] box-border flex items-center justify-center rounded-2xl group transition',
            itemClasses[variant],
          )}
        >
          <Link
            className="flex items-center justify-center w-full h-full"
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
          </Link>
        </div>
      </Tooltip>
    </li>
  )
}
