import { useWalletDispatch } from "context/wallet/WalletProvider";
import { useConnectWallet, useWalletBalance, useWalletConnectModal } from "context/wallet/hooks";
import { useWalletDrawer } from "hooks/useWalletDrawer";
import { useCallback, useState } from "react";
import { SUPPORTED_CHAINS } from "settings/chain";
import { IS_LEDGER_LIVE } from "settings/config";

export const useWalletDrawerActions = () => {
  const walletDispatch = useWalletDispatch();
  const { connectLedgerLiveWallet } = useConnectWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWalletByChain } = useWalletBalance();
  const { close } = useWalletDrawer();

  const [isDisconnectModalOpened, setIsDisconnectModalOpened] = useState(false);

  const handleAddConnectWallet = useCallback(() => {
    close();
    IS_LEDGER_LIVE ? connectLedgerLiveWallet() : setIsConnectModalOpen(true);
  }, [close, connectLedgerLiveWallet, setIsConnectModalOpen]);

  const onConfirmDisconnect = useCallback(() => {
    close();
    walletDispatch({ type: "disconnect", payload: undefined });
    setIsDisconnectModalOpened(false);
  }, [close, walletDispatch]);

  const onCancelDisconnect = useCallback(() => {
    setIsDisconnectModalOpened(false);
  }, []);

  const openDisconnectConfirmModal = useCallback(() => {
    setIsDisconnectModalOpened(true);
  }, []);

  const handleRefresh = useCallback(() => {
    for (const chain of SUPPORTED_CHAINS) {
      getWalletByChain(chain);
    }
  }, [getWalletByChain]);

  return {
    handleAddConnectWallet,
    handleRefresh,
    isDisconnectModalOpened,
    openDisconnectConfirmModal,
    onCancelDisconnect,
    onConfirmDisconnect,
  };
};
