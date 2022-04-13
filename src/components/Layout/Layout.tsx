import { ReactNode, useState } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { Header } from 'components/Header'
import { NavDrawer } from 'components/NavDrawer'
import { Scrollbar } from 'components/Scrollbar'
import { Sidebar } from 'components/Sidebar'
import { WalletModal } from 'components/WalletModal'

export type LayoutProp = {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProp) => {
  const [isMenuVisible, setMenuVisible] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const openMenu = () => {
    setMenuVisible(true)
  }

  const hideMenu = () => {
    setMenuVisible(false)
  }

  return (
    <Scrollbar className="bg-light-bg-primary dark:bg-dark-bg-primary transition-all">
      <div className="bg-elliptical-light dark:bg-elliptical transition-colors fixed inset-0"></div>

      <Box
        col
        className="relative w-full min-h-screen my-0 px-[calc(50%-720px)]"
      >
        <aside className="fixed hidden md:block">
          <Sidebar
            collapsed={sidebarCollapsed}
            toggle={() => setSidebarCollapsed((v) => !v)}
          />
        </aside>

        <aside className="md:hidden">
          <NavDrawer isVisible={isMenuVisible} hideMenu={hideMenu} />
        </aside>

        <main
          className={classNames(
            'flex flex-col md:max-w-[calc(100%-148px)] mx-3 md:px-10 py-5 ease-in-out transition-[margin]',
            sidebarCollapsed ? 'md:ml-24' : 'md:ml-48',
          )}
        >
          <Header openMenu={openMenu} />
          {children}
        </main>

        <WalletModal />
      </Box>
    </Scrollbar>
  )
}
