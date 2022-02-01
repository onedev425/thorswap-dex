/* eslint-disable react/jsx-no-target-blank */
import classNames from 'classnames'

import { Tooltip } from 'components/Tooltip'

import { Icon } from '../Icon'
import { NavItemProps } from './types'

const itemClasses = {
  primary: 'hover:bg-light-btn-primary hover:dark:bg-dark-btn-primary',
  secondary: 'hover:bg-light-btn-secondary hover:dark:bg-dark-btn-secondary',
}

const iconClasses = {
  primary: 'text-light-typo-primary dark:text-dark-typo-primary',
  secondary: 'text-light-btn-secondary dark:text-dark-btn-secondary',
}

export const NavItem = ({
  iconName,
  href,
  isExternal = false,
  variant = 'primary',
  spaced = true,
  className = '',
  tooltip,
}: NavItemProps) => {
  return (
    <div
      className={classNames({
        'mb-2': spaced && variant === 'secondary',
        'mb-8': spaced && variant === 'primary',
      })}
    >
      <Tooltip content={tooltip} place="right">
        <li
          className={classNames(
            'w-8 h-8 p-1 inline-flex items-center justify-center rounded-2xl group transition',
            itemClasses[variant],
            className,
          )}
        >
          <a
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            href={href}
            className="w-full h-full inline-flex justify-center items-center"
          >
            <Icon
              name={iconName}
              className={classNames(
                'transition group-hover:stroke-white',
                iconClasses[variant],
              )}
              size={18}
            />
          </a>
        </li>
      </Tooltip>
    </div>
  )
}
