import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { Header } from 'components/Header';
import { ConnectWalletModal } from 'components/Modals/ConnectWalletModal';
import { Scrollbar } from 'components/Scrollbar';
import { Sidebar } from 'components/Sidebar';
import type { PropsWithChildren } from 'react';
import { useCallback, useState } from 'react';
import { IS_LEDGER_LIVE, IS_STAGENET } from 'settings/config';
import { useApp } from 'store/app/hooks';

import { NavDrawer } from './NavDrawer';

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { toggleSidebarCollapse, isSidebarCollapsed } = useApp();
  const openMenu = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const hideMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    toggleSidebarCollapse(!isSidebarCollapsed);
  }, [isSidebarCollapsed, toggleSidebarCollapse]);

  return (
    <Scrollbar
      className={
        IS_STAGENET
          ? 'bg-light-bg-stagenet dark:bg-dark-bg-stagenet'
          : 'bg-light-layout-primary dark:bg-dark-bg-primary'
      }
    >
      <Box col className="min-h-screen my-0 px-[calc(50%-720px)]" flex={1}>
        {!IS_LEDGER_LIVE && (
          <>
            <aside className="fixed hidden md:block">
              <Sidebar collapsed={isSidebarCollapsed} toggle={toggleSidebar} />
            </aside>
            <aside className="md:hidden">
              <NavDrawer hideMenu={hideMenu} isVisible={isMenuVisible} />
            </aside>
          </>
        )}
        <main
          className={classNames(
            'flex flex-col mx-3 md:px-10 py-5 ease-in-out transition-[margin]',
            isSidebarCollapsed ? 'md:ml-24' : 'md:ml-48',
            IS_LEDGER_LIVE ? '!ml-3' : 'md:max-w-[calc(100%-148px)]',
          )}
        >
          <Header openMenu={openMenu} />
          {children}
        </main>
        {!IS_LEDGER_LIVE && <ConnectWalletModal />}
      </Box>
    </Scrollbar>
  );
};
