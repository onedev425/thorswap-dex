import classNames from 'classnames'

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

export const NavItem = (props: NavItemProps) => {
  const {
    iconName,
    href,
    isExternal = false,
    variant = 'primary',
    spaced = true,
    className = '',
  } = props

  const anchorProps: React.HTMLProps<HTMLAnchorElement> = {
    href,
  }
  if (isExternal) {
    anchorProps.target = '_blank'
    anchorProps.rel = 'noopener noreferrer'
  }

  return (
    <li
      className={classNames(
        'w-8 h-8 p-1 rounded-2xl group transition',
        itemClasses[variant],
        {
          'mb-2': spaced && variant === 'secondary',
          'mb-8': spaced && variant === 'primary',
        },
        className,
      )}
    >
      <a
        {...anchorProps}
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
  )
}
