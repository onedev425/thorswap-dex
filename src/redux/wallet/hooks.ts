import { useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'

import { ConnectType as TerraConnectType } from '@terra-money/wallet-provider'
import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import { Keystore } from '@thorswap-lib/xchain-crypto'
import { Chain, ETHChain, TERRAChain } from '@thorswap-lib/xchain-util'

import { RootState } from 'redux/store'

import { useTerraWallet } from 'hooks/useTerraWallet'

import { multichain } from 'services/multichain'

import * as walletActions from './actions'
import { actions } from './slice'

export const useWallet = () => {
  const dispatch = useDispatch()

  const {
    connectedWallet,
    terraWallets,
    connectTerraWallet,
    isTerraWalletConnected,
  } = useTerraWallet()

  const walletState = useSelector((state: RootState) => state.wallet)

  const { walletLoading, chainWalletLoading } = walletState
  const walletLoadingByChain = Object.keys(chainWalletLoading).map(
    (chain) => chainWalletLoading[chain as SupportedChain],
  )
  const isWalletLoading = walletLoadingByChain.reduce(
    (status, next) => status || next,
    walletLoading,
  )

  const unlockWallet = useCallback(
    async (keystore: Keystore, phrase: string, chains: SupportedChain[]) => {
      // set multichain phrase
      multichain.connectKeystore(phrase, chains)

      dispatch(actions.connectKeystore(keystore))
      chains.map((chain: SupportedChain) => {
        dispatch(walletActions.getWalletByChain({ chain, multichain }))
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
      await multichain.connectLedger({ chain, addressIndex })

      dispatch(
        walletActions.getWalletByChain({
          chain: chain as SupportedChain,
          multichain,
        }),
      )
    },
    [dispatch],
  )

  const connectXdefiWallet = useCallback(
    async (chains: SupportedChain[]) => {
      await multichain.connectXDefiWallet(chains)

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain({ chain, multichain }))
      })
    },
    [dispatch],
  )

  const connectMetamask = useCallback(async () => {
    await multichain.connectMetamask()

    dispatch(walletActions.getWalletByChain({ chain: ETHChain, multichain }))
  }, [dispatch])

  const connectTerraStation = useCallback(async () => {
    connectTerraWallet(TerraConnectType.EXTENSION)

    if (!isTerraWalletConnected || !connectedWallet) {
      throw Error('Terra station wallet not connected')
    }

    const address = terraWallets.filter(
      (data) => data.connectType === TerraConnectType.EXTENSION,
    )?.[0]?.terraAddress

    if (!address) {
      throw Error('Terra station wallet not connected')
    }

    console.log('terra station connected', address)

    await multichain.connectTerraStation(connectedWallet, address)

    dispatch(walletActions.getWalletByChain({ chain: TERRAChain, multichain }))
  }, [
    dispatch,
    terraWallets,
    connectTerraWallet,
    connectedWallet,
    isTerraWalletConnected,
  ])

  const connectTrustWallet = useCallback(
    async (chains: SupportedChain[]) => {
      await multichain.connectTrustWallet(chains, {
        listeners: {
          disconnect: disconnectWallet,
        },
      })

      chains.forEach((chain) => {
        dispatch(walletActions.getWalletByChain({ chain, multichain }))
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
      dispatch(walletActions.getWalletByChain({ chain, multichain }))
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
