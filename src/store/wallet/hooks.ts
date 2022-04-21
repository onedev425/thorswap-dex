import { useCallback, useEffect, useRef } from 'react'

import {
  ConnectedWallet,
  ConnectType as TerraConnectType,
} from '@terra-money/wallet-provider'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'
import { Chain, ETHChain, TERRAChain } from '@thorswap-lib/xchain-util'

import { showToast, ToastType } from 'components/Toast'

import { useAppDispatch, useAppSelector } from 'store/store'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import * as walletActions from './actions'
import { actions } from './slice'

export const useWallet = () => {
  const checkWalletConnection = useRef(false)
  const dispatch = useAppDispatch()
  const walletState = useAppSelector(({ wallet }) => wallet)

  const {
    connectedWallet,
    terraWallets,
    connectTerraWallet,
    isTerraWalletConnected,
  } = useTerraWallet()

  const isWalletLoading =
    walletState.walletLoading ||
    Object.values(walletState.chainWalletLoading).some((loading) => loading)

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string, chains: SupportedChain[]) => {
      // set multichain phrase
      multichain.connectKeystore(phrase, chains)

      dispatch(actions.connectKeystore(keystore))
      chains.map((chain: SupportedChain) => {
        dispatch(walletActions.getWalletByChain(chain))
      })
    },
    [dispatch],
  )

  const disconnectWallet = useCallback(() => {
    multichain.resetClients()

    dispatch(actions.disconnect())
  }, [dispatch])

  const disconnectWalletByChain = useCallback(
    (chain: SupportedChain) => {
      multichain.resetChain(chain)

      dispatch(actions.disconnectByChain(chain))
    },
    [dispatch],
  )

  const connectLedger = useCallback(
    async (chain: Chain, addressIndex: number) => {
      const options = { chain, index: addressIndex }

      try {
        showToast({ message: t('notification.connectingLedger', options) })
        await multichain.connectLedger({ chain, addressIndex })

        dispatch(walletActions.getWalletByChain(chain as SupportedChain))
        showToast({ message: t('notification.connectedLedger', options) })
      } catch (error) {
        console.error(error)
        showToast(
          { message: t('notification.ledgerFailed', options) },
          ToastType.Error,
        )
      }
    },
    [dispatch],
  )

  const connectXdefiWallet = useCallback(
    async (chains: SupportedChain[]) => {
      await multichain.connectXDefiWallet(chains)

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain(chain))
      })
    },
    [dispatch],
  )

  const connectMetamask = useCallback(async () => {
    await multichain.connectMetamask()

    dispatch(walletActions.getWalletByChain(ETHChain))
  }, [dispatch])

  const connectTerraMultichain = useCallback(
    async ({
      address,
      wallet,
    }: {
      address?: string
      wallet: ConnectedWallet
    }) => {
      if (address) {
        await multichain.connectTerraStation(wallet, address)

        dispatch(walletActions.getWalletByChain(TERRAChain))
      } else {
        console.error('Terra station wallet not connected')
      }
    },
    [dispatch],
  )

  const connectTerraStation = useCallback(
    async (connectType: TerraConnectType, identifier?: string) => {
      connectTerraWallet(connectType, identifier)
      checkWalletConnection.current = true

      if (connectType === TerraConnectType.EXTENSION) {
        if (!isTerraWalletConnected || !connectedWallet) {
          throw Error('Terra station wallet not connected')
        }

        const address = terraWallets.filter(
          (data) => data.connectType === connectType,
        )?.[0]?.terraAddress

        connectTerraMultichain({ address, wallet: connectedWallet })
      }
    },
    [
      connectTerraWallet,
      isTerraWalletConnected,
      connectedWallet,
      terraWallets,
      connectTerraMultichain,
    ],
  )

  useEffect(() => {
    if (checkWalletConnection.current && connectedWallet) {
      checkWalletConnection.current = false
      connectTerraMultichain({
        wallet: connectedWallet,
        address: connectedWallet?.walletAddress,
      })
    }
  }, [connectTerraMultichain, connectedWallet])

  const connectTrustWallet = useCallback(
    async (chains: SupportedChain[]) => {
      await multichain.connectTrustWallet(chains, {
        listeners: { disconnect: disconnectWallet },
      })

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain(chain))
      })
    },
    [dispatch, disconnectWallet],
  )

  const setIsConnectModalOpen = useCallback(
    (visible: boolean) => {
      dispatch(actions.setIsConnectModalOpen(visible))
    },
    [dispatch],
  )

  const refreshWalletByChain = useCallback(
    (chain: SupportedChain) => {
      dispatch(walletActions.getWalletByChain(chain))
    },
    [dispatch],
  )

  return {
    ...walletState,
    ...walletActions,
    isWalletLoading,
    unlockWallet,
    setIsConnectModalOpen,
    disconnectWallet,
    disconnectWalletByChain,
    connectXdefiWallet,
    connectMetamask,
    connectTrustWallet,
    connectLedger,
    connectTerraStation,
    refreshWalletByChain,
  }
}
