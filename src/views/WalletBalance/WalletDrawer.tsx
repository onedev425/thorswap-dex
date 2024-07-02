import { Drawer, DrawerBody, DrawerContent, DrawerOverlay } from "@chakra-ui/react";
import { useWalletDrawer } from "hooks/useWalletDrawer";
import useWindowSize from "hooks/useWindowSize";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const WalletDrawer = ({ children }: Props) => {
  const { isMdActive } = useWindowSize();
  const { setIsDrawerVisible, isOpened } = useWalletDrawer();

  return (
    <Drawer
      closeOnOverlayClick
      isOpen={isOpened}
      onClose={() => setIsDrawerVisible(false)}
      placement="right"
      size={isMdActive ? "md" : "sm"}
    >
      <DrawerOverlay className="backdrop-blur-md" />
      <DrawerContent className="overflow-y-auto !bg-light-bg-secondary p-0 dark:!bg-dark-bg-secondary h-full shadow-inner rounded-l-xl">
        <DrawerBody padding={0}>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
