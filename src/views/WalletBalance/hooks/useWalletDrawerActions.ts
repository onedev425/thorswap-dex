import { useState } from 'react'

import { SUPPORTED_CHAINS } from '@thorswap-lib/multichain-sdk'

import { useWallet } from 'redux/wallet/hooks'

import { useWalletDrawer } from 'hooks/useWalletDrawer'

export const useWalletDrawerActions = () => {
  const {
    setIsConnectModalOpen,
    disconnectWallet,
    wallet,
    refreshWalletByChain,
    isWalletLoading,
  } = useWallet()
  const { close } = useWalletDrawer()
  const [isDisconnectModalOpened, setIsDisconnectModalOpened] = useState(false)

  const handleAddConnectWallet = () => {
    close()
    setIsConnectModalOpen(true)
  }

  const onConfirmDisconnect = () => {
    close()
    disconnectWallet()
    setIsDisconnectModalOpened(false)
  }

  const onCancelDisconnect = () => {
    setIsDisconnectModalOpened(false)
  }

  const openDisconnectConfirmModal = () => {
    setIsDisconnectModalOpened(true)
  }

  const handleRefresh = () => {
    if (wallet) {
      SUPPORTED_CHAINS.forEach((chain) => {
        if (wallet[chain]) {
          refreshWalletByChain(chain)
        }
      })
    }
  }

  return {
    handleAddConnectWallet,
    handleRefresh,
    isDisconnectModalOpened,
    openDisconnectConfirmModal,
    onCancelDisconnect,
    onConfirmDisconnect,
    isRefreshing: isWalletLoading,
  }
}
