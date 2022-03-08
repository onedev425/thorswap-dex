import { ReactNode, useState } from 'react'

import { Scrollbars } from 'react-custom-scrollbars'

import classNames from 'classnames'

import { Header } from 'components/Header'
import { NavDrawer } from 'components/NavDrawer'
import { Sidebar } from 'components/Sidebar'
import { WalletModal } from 'components/WalletModal'

export type LayoutProp = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProp) => {
  const [isMenuVisible, setMenuVisible] = useState(false)

  const openMenu = () => {
    setMenuVisible(true)
  }

  const hideMenu = () => {
    setMenuVisible(false)
  }

  return (
    <Scrollbars
      autoHide
      renderThumbVertical={({ style, ...scrollProps }) => (
        <div
          style={{ ...style, backgroundColor: '#00d2ff', width: '4px' }}
          {...scrollProps}
        />
      )}
      style={{ height: '100vh' }}
    >
      <div className="relative flex flex-col w-full min-h-screen mx-auto my-0 max-w-8xl">
        <aside className="fixed hidden md:block">
          <Sidebar collapsed />
        </aside>

        <aside className="md:hidden">
          <NavDrawer isVisible={isMenuVisible} hideMenu={hideMenu} />
        </aside>

        <main
          className={classNames(
            'flex flex-col md:ml-[92px] md:max-w-[calc(100%-148px)] mx-3 md:px-10 py-5 dark:bg-elliptical',
          )}
        >
          <Header openMenu={openMenu} />
          {children}
        </main>
        <WalletModal />
      </div>
    </Scrollbars>
  )
}
