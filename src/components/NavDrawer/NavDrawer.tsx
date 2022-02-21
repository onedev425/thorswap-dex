import { useRef } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Box'
import { navbarOptions } from 'components/Sidebar/data'
import { SidebarItemProps } from 'components/Sidebar/types'

import useOnClickOutside from 'hooks/useClickOutside'

import LogoImg from '../Announcement/assets/images/logo.png'
import { NavMenuItems } from './NavMenuItems'

type NavDrawerProps = {
  isVisible: boolean
  hideMenu: () => void
}

export const NavDrawer = ({ isVisible, hideMenu }: NavDrawerProps) => {
  const navRef = useRef<HTMLElement>(null)
  useOnClickOutside(navRef, () => isVisible && hideMenu())

  return (
    <>
      <nav
        ref={navRef}
        className={classNames(
          'duration-300 fixed min-h-screen max-h-screen h-full',
          isVisible
            ? 'opacity-100 z-20 translate-x-[0px]'
            : 'opacity-0 -z-10 -translate-x-[300px]',
        )}
      >
        <Box
          col
          className="w-[300px] p-4 h-full bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-2xl border-box"
        >
          <Box center py={4}>
            <a href="/">
              <img className="w-12 h-12" src={LogoImg} alt="Logo" />
            </a>
          </Box>

          {navbarOptions.map(({ children, label, href }: SidebarItemProps) => (
            <NavMenuItems
              hideMenu={hideMenu}
              key={label}
              label={label}
              to={href}
              items={children}
            />
          ))}
        </Box>
      </nav>

      <div
        className={classNames({
          'absolute z-10 top-0 left-0 right-0 bottom-0 transition-opacity duration-300 ease-in-out backdrop-blur-md':
            isVisible,
        })}
      />
    </>
  )
}
