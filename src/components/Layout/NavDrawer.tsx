import { memo, useRef } from 'react'

import classNames from 'classnames'

import { Sidebar } from 'components/Sidebar'

import useOnClickOutside from 'hooks/useClickOutside'

type Props = {
  isVisible: boolean
  hideMenu: () => void
}

export const NavDrawer = memo(({ isVisible, hideMenu }: Props) => {
  const navRef = useRef<HTMLDivElement>(null)

  useOnClickOutside(navRef, () => isVisible && hideMenu())

  return (
    <>
      <div
        className={classNames({
          'absolute z-30 top-0 left-0 right-0 bottom-0 transition-opacity duration-300 ease-in-out backdrop-blur-md':
            isVisible,
        })}
      />

      <div
        ref={navRef}
        className={classNames(
          'duration-300 fixed min-h-screen max-h-screen h-full',
          isVisible
            ? 'opacity-100 z-40 translate-x-[0px]'
            : 'opacity-0 -z-10 -translate-x-[300px]',
        )}
      >
        <Sidebar className="!bg-opacity-100" onNavItemClick={hideMenu} />
      </div>
    </>
  )
})
