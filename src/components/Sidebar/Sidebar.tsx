import classNames from 'classnames'

import { Link } from 'components/Link'

import LogoImg from 'assets/images/logo.png'

import { Icon } from '../Icon'
import { navbarOptions } from './data'
import { NavItem } from './NavItem'
import { SidebarProps, SidebarItemProps, Variant } from './types'

const listClasses = {
  primary: 'rounded-2xl',
  secondary: 'rounded-2xl bg-green bg-opacity-10 mb-6',
}

const renderMenu = (options: SidebarItemProps[], variant: Variant) => {
  return (
    <ul
      className={classNames(
        'p-0 m-0 list-none flex flex-col items-center',
        listClasses[variant],
      )}
    >
      {options.map(({ hasSub, label, children, ...rest }: SidebarItemProps) => {
        if (hasSub && children) return renderMenu(children, 'secondary')

        return (
          <NavItem
            key={label}
            className={classNames(
              variant === 'primary' ? 'mb-6' : 'mb-2',
              'last-of-type:mb-0',
            )}
            variant={variant}
            tooltip={label}
            {...rest}
          />
        )
      })}
    </ul>
  )
}

export const Sidebar = (props: SidebarProps) => {
  const { options = navbarOptions } = props

  return (
    <nav className="flex flex-col items-center justify-between max-w-[72px] min-h-screen max-h-screen w-full h-full bg-light-bg-primary dark:bg-dark-bg-primary px-2.5 border-box sticky top-0 transition-colors">
      <div className="mt-8 min-w-[48px] h-12 transition-colors cursor-pointer">
        <a href="/">
          <img className="w-12 h-12" src={LogoImg} alt="Logo" />
        </a>
      </div>

      {renderMenu(options, 'primary')}

      <Link className="flex items-center justify-center w-10 h-10 mb-6" to="/">
        <Icon
          name="threedots"
          className="text-light-typo-primary dark:text-dark-typo-primary"
          size={18}
        />
      </Link>
    </nav>
  )
}
