import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type WalletDrawerContextType = {
  isOpened: boolean;
  setIsDrawerVisible: (visible: boolean) => void;
  onToggle: () => void;
  close: () => void;
};

export const WalletDrawerContext = createContext({
  isOpened: false,
  setIsDrawerVisible: (_: boolean) => {},
  onToggle: () => {},
  close: () => {},
} as WalletDrawerContextType);

type Props = {
  children?: ReactNode;
};

const WalletDrawerProvider = ({ children }: Props) => {
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpened ? 'hidden' : 'unset';
  }, [isOpened]);

  const onToggle = useCallback(() => {
    setIsOpened((v) => !v);
  }, []);

  const setIsDrawerVisible = useCallback((visible: boolean) => {
    setIsOpened(visible);
  }, []);

  const close = useCallback(() => {
    setIsOpened(false);
  }, []);

  return (
    <WalletDrawerContext.Provider value={{ isOpened, setIsDrawerVisible, onToggle, close }}>
      {children}
    </WalletDrawerContext.Provider>
  );
};

export const useWalletDrawer = () => {
  return useContext(WalletDrawerContext);
};

export default WalletDrawerProvider;
