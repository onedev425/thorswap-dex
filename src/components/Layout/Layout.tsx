import { PropsWithChildren, useCallback, useState } from 'react'

import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { Header } from 'components/Header'
import { WalletModal } from 'components/Modals/WalletModal'
import { Scrollbar } from 'components/Scrollbar'
import { Sidebar } from 'components/Sidebar'

import { useApp } from 'store/app/hooks'

import { NavDrawer } from './NavDrawer'

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  const [isMenuVisible, setMenuVisible] = useState(false)
  const { toggleSidebarCollapse, isSidebarCollapsed } = useApp()
  const openMenu = useCallback(() => {
    setMenuVisible(true)
  }, [])

  const hideMenu = useCallback(() => {
    setMenuVisible(false)
  }, [])

  const toggleSidebar = useCallback(() => {
    toggleSidebarCollapse(!isSidebarCollapsed)
  }, [isSidebarCollapsed, toggleSidebarCollapse])

  return (
    <Scrollbar
      className={
        import.meta.env.VITE_IS_STAGENET === 'true'
          ? 'bg-light-bg-stagenet dark:bg-dark-bg-stagenet'
          : import.meta.env.VITE_NETWORK === 'mainnet'
          ? 'bg-light-layout-primary dark:bg-dark-bg-primary'
          : 'bg-light-bg-testnet dark:bg-dark-bg-testnet'
      }
    >
      {/* <div className="fixed inset-0 transition-colors light-elliptical-bg dark:bg-elliptical"></div> */}

      <Box col flex={1} className="min-h-screen my-0 px-[calc(50%-720px)]">
        <aside className="fixed hidden md:block">
          <Sidebar collapsed={isSidebarCollapsed} toggle={toggleSidebar} />
        </aside>

        <aside className="md:hidden">
          <NavDrawer isVisible={isMenuVisible} hideMenu={hideMenu} />
        </aside>

        <main
          className={classNames(
            'flex flex-col md:max-w-[calc(100%-148px)] mx-3 md:px-10 py-5 ease-in-out transition-[margin]',
            isSidebarCollapsed ? 'md:ml-24' : 'md:ml-48',
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
