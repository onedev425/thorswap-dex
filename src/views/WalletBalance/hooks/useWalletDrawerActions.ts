import { useWalletDrawer } from 'hooks/useWalletDrawer';
import { useState } from 'react';
import { SUPPORTED_CHAINS } from 'settings/chain';
import { useWallet } from 'store/wallet/hooks';
import { SUPPORTED_CHAINS } from 'settings/chain';

export const useWalletDrawerActions = () => {
  const { setIsConnectModalOpen, disconnectWallet, wallet, refreshWalletByChain, isWalletLoading } =
    useWallet();
  const { close } = useWalletDrawer();
  const [isDisconnectModalOpened, setIsDisconnectModalOpened] = useState(false);

  const handleAddConnectWallet = () => {
    close();
    setIsConnectModalOpen(true);
  };

  const onConfirmDisconnect = () => {
    close();
    disconnectWallet();
    setIsDisconnectModalOpened(false);
  };

  const onCancelDisconnect = () => {
    setIsDisconnectModalOpened(false);
  };

  const openDisconnectConfirmModal = () => {
    setIsDisconnectModalOpened(true);
  };

  const handleRefresh = () => {
    if (wallet) {
      SUPPORTED_CHAINS.forEach((chain) => {
        if (wallet[chain]) {
          refreshWalletByChain(chain);
        }
      });
    }
  };

  return {
    handleAddConnectWallet,
    handleRefresh,
    isDisconnectModalOpened,
    openDisconnectConfirmModal,
    onCancelDisconnect,
    onConfirmDisconnect,
    isRefreshing: isWalletLoading,
  };
};
