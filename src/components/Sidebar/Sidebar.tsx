import classNames from 'classnames'

import { Icon } from '../Icon'
import { navbarOptions } from './data'
import { NavItem } from './NavItem'
import { SidebarProps, SidebarItemProps, Variant } from './types'

const listClasses = {
  primary: 'rounded-lg',
  secondary: 'rounded-2xl bg-green bg-opacity-20 mb-6',
}

const renderChildren = (children: SidebarItemProps[], variant: Variant) => {
  return (
    <ul
      className={classNames(
        'p-0 m-0 list-none flex flex-col items-center',
        listClasses[variant],
      )}
    >
      {children.map((child: SidebarItemProps, index: number) => {
        if (child.hasSub && child.children) {
          return (
            <>
              <NavItem
                key={child.label}
                iconName={child.iconName}
                href={child.href}
                isExternal={child.isExternal}
                variant={variant}
                spaced={index !== children.length - 1}
              />
              {renderChildren(child.children, 'secondary')}
            </>
          )
        }
        return (
          <NavItem
            key={child.label}
            iconName={child.iconName}
            href={child.href}
            isExternal={child.isExternal}
            variant={variant}
            spaced={index !== children.length - 1}
          />
        )
      })}
    </ul>
  )
}

export const Sidebar = (props: SidebarProps) => {
  const { options = navbarOptions } = props

  return (
    <nav className="flex flex-col items-center justify-between max-w-[72px] min-h-screen bg-light-bg-secondary dark:bg-dark-bg-secondary px-2.5 rounded-3xl border-box sticky top-0">
      <div
        className={classNames(
          'inline-flex justify-center items-center box-border min-w-[48px] min-h-[48px] rounded-2xl border border-solid mt-8',
          'border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary',
        )}
      >
        <a href="/">
          <Icon name="lightning" className="fill-red stroke-cyan" size={32} />
        </a>
      </div>

      {renderChildren(options, 'primary')}

      <ul className="flex flex-col items-center p-0 m-0 mb-6 list-none">
        <li className="flex justify-center items-center box-border min-w-[40px] min-h-[40px] border border-solid border-light-border-primary dark:border-dark-border-primary p-1 rounded-2xl">
          <a
            href="/"
            className="inline-flex items-center justify-center w-full min-h-full"
          >
            <Icon
              name="threedots"
              className="text-light-typo-primary dark:text-dark-typo-primary"
              size={18}
            />
          </a>
        </li>
      </ul>
    </nav>
  )
}
