import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from '@chakra-ui/react';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const WalletDrawer = ({ children }: Props) => {
  const { setIsDrawerVisible, isOpened } = useWalletDrawer();

  return (
    <Drawer
      closeOnOverlayClick
      isOpen={isOpened}
      onClose={() => setIsDrawerVisible(false)}
      placement="right"
    >
      <DrawerOverlay className="backdrop-blur-md" />
      <DrawerContent className="overflow-y-auto bg-light-bg-secondary p-0 dark:bg-dark-bg-secondary h-full shadow-inner rounded-l-xl">
        <DrawerBody padding={0}>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
