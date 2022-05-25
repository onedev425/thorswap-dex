import { useCallback, useEffect, useRef } from 'react'

import { batch } from 'react-redux'

import {
  ConnectedWallet,
  ConnectType as TerraConnectType,
} from '@terra-money/wallet-provider'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'
import {
  Chain,
  ETHChain,
  SOLChain,
  TERRAChain,
} from '@thorswap-lib/xchain-util'

import { showToast, ToastType } from 'components/Toast'

import { actions as midgardActions } from 'store/midgard/slice'
import { useAppDispatch, useAppSelector } from 'store/store'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { getFromStorage, saveInStorage } from 'helpers/storage'

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

    batch(() => {
      dispatch(actions.disconnect())
      dispatch(midgardActions.resetChainMemberDetails())
    })
  }, [dispatch])

  const disconnectWalletByChain = useCallback(
    (chain: SupportedChain) => {
      multichain.resetChain(chain)

      batch(() => {
        dispatch(actions.disconnectByChain(chain))
        dispatch(midgardActions.resetChainMemberDetail(chain))
      })
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

  const connectPhantom = useCallback(async () => {
    await multichain.connectPhantom()

    dispatch(walletActions.getWalletByChain(SOLChain))
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

      /**
       * When XDefi wallet has prio, but user uses Terra Station Wallet extension it saves `station` identifier in storage
       * Unfortunately, because of that, when XDefi wallet is locked it will trigger popup to unlock it on every page reload
       * To prevent this we are clearing `station` identifier from storage
       */
      const activeTerraSession = getFromStorage('terraWalletSession')
      if (activeTerraSession === 'station') {
        saveInStorage({ key: 'terraWalletSession', value: '' })
      }
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
    connectPhantom,
    connectTrustWallet,
    connectLedger,
    connectTerraStation,
    refreshWalletByChain,
  }
}
