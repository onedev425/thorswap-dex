import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { Icon, Link } from 'components/Atomic'

import { ROUTES } from 'settings/constants'

import Logo from '../Announcement/assets/images/logo.png'
import { navbarOptions } from './data'
import { NavItem } from './NavItem'
import { SidebarProps, SidebarItemProps, Variant } from './types'

const renderMenu = (options: SidebarItemProps[], variant: Variant) => {
  return (
    <ul
      key={variant}
      className={classNames(
        'flex flex-col items-center rounded-2xl p-0 m-0 list-none',
        { 'bg-green bg-opacity-10 mb-6': variant === 'secondary' },
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

export const Sidebar = ({ options = navbarOptions }: SidebarProps) => {
  const navigate = useNavigate()

  return (
    <nav
      className={classNames(
        'flex flex-col items-center justify-between px-2.5',
        'max-w-[72px] min-w-[72px] min-h-screen w-full h-full',
        'bg-light-bg-primary dark:bg-dark-bg-primary border-box sticky top-0',
      )}
    >
      <div
        onClick={() => navigate(ROUTES.Home)}
        className="mt-8 min-w-[48px] h-12 transition-colors cursor-pointer"
      >
        <img className="w-12 h-12" src={Logo} alt="Logo" />
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
