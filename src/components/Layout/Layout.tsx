import classNames from 'classnames';
import { Box } from 'components/Atomic';
import { Header } from 'components/Header';
import { ConnectWalletModal } from 'components/Modals/ConnectWalletModal';
import { Scrollbar } from 'components/Scrollbar';
import { Sidebar } from 'components/Sidebar';
import { PropsWithChildren, useCallback, useState } from 'react';
import { IS_BETA, IS_MAINNET, IS_PROD, IS_STAGENET } from 'settings/config';
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
          : IS_PROD || IS_MAINNET || IS_BETA
          ? 'bg-light-layout-primary dark:bg-dark-bg-primary'
          : 'bg-light-bg-testnet dark:bg-dark-bg-testnet'
      }
    >
      <Box col className="min-h-screen my-0 px-[calc(50%-720px)]" flex={1}>
        <aside className="fixed hidden md:block">
          <Sidebar collapsed={isSidebarCollapsed} toggle={toggleSidebar} />
        </aside>

        <aside className="md:hidden">
          <NavDrawer hideMenu={hideMenu} isVisible={isMenuVisible} />
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

        <ConnectWalletModal />
      </Box>
    </Scrollbar>
  );
};
