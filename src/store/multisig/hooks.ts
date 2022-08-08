import { useCallback, useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'

import { showErrorToast } from 'components/Toast'

import { loadMultisigBalances } from 'store/multisig/actions'
import { actions } from 'store/multisig/slice'
import { MultisigMember, MultisigWallet } from 'store/multisig/types'
import { useAppDispatch, useAppSelector } from 'store/store'

import { multichain } from 'services/multichain'
import {
  multisig,
  MultisigDepositTxParams,
  MultisigTransferTxParams,
  Signer,
} from 'services/multisig'

export const useMultisig = () => {
  const { address, members, treshold } = useAppSelector(
    (state) => state.multisig,
  )

  const dispatch = useAppDispatch()

  const multisigActions = useMemo(
    () => ({
      addMultisigWallet: (wallet: MultisigWallet) => {
        dispatch(actions.addMultisigWallet(wallet))
      },
      clearMultisigWallet: () => {
        dispatch(actions.clearMultisigWallet())
        multisig.clearMultisigWallet()
      },
    }),
    [dispatch],
  )

  const initMultisigWallet = useCallback(() => {
    const existingAddress = multichain.thor.multisigAddress

    return existingAddress === address
      ? address
      : multisig.createMultisigWallet(members, treshold)
  }, [address, members, treshold])

  const getSignersSequence = useCallback(
    (signers: MultisigMember[]) => {
      return multisig.getSignersSequence(members, signers)
    },
    [members],
  )

  const createTransferTx = useCallback(
    async (txParams: MultisigTransferTxParams, signers: MultisigMember[]) => {
      initMultisigWallet()
      const signersSequece = getSignersSequence(signers)

      try {
        const tx = await multisig.buildTransferTx(txParams, signersSequece)
        return tx
      } catch (e: ErrorType) {
        showErrorToast(e.message)
      }
    },
    [getSignersSequence, initMultisigWallet],
  )

  const createDepositTx = useCallback(
    async (txParams: MultisigDepositTxParams, signers: MultisigMember[]) => {
      initMultisigWallet()
      const signersSequece = getSignersSequence(signers)

      try {
        const tx = await multisig.buildDepositTx(txParams, signersSequece)
        return tx
      } catch (e: ErrorType) {
        showErrorToast(e.message)
      }
    },
    [getSignersSequence, initMultisigWallet],
  )

  const importTx = useCallback(
    async (txStr: string) => {
      initMultisigWallet()

      try {
        const tx = await multisig.importMultisigTx(txStr)
        return tx
      } catch (e: ErrorType) {
        showErrorToast(e.message)
      }
    },
    [initMultisigWallet],
  )

  const signTx = useCallback(
    async (tx: string) => {
      initMultisigWallet()

      try {
        return await multisig.signMultisigTx(tx)
      } catch (e: ErrorType) {
        showErrorToast(e.message)
      }
    },
    [initMultisigWallet],
  )

  const broadcastTx = useCallback(
    async (tx: string, signers: Signer[]) => {
      initMultisigWallet()

      try {
        return await multisig.broadcastMultisigTx(tx, signers)
      } catch (e: ErrorType) {
        showErrorToast(e.message)
      }
    },
    [initMultisigWallet],
  )

  const loadBalances = useCallback(async () => {
    initMultisigWallet()

    if (multichain.thor.multisigAddress) {
      dispatch(loadMultisigBalances())
    }
  }, [dispatch, initMultisigWallet])

  const getPubkeyForAddress = useCallback(
    (address: string) => {
      return multisig.getMemberPubkeyFromAddress(address, members)
    },
    [members],
  )

  const getSortedSigners = useCallback(
    (signers: Signer[]) => {
      const sortedSigners = [...signers]

      return sortedSigners.sort(
        (a, b) =>
          members.findIndex((m) => m.pubKey === a.pubKey) -
          members.findIndex((m) => m.pubKey === b.pubKey),
      )
    },
    [members],
  )

  const isMultsigActivated = useCallback(() => {
    initMultisigWallet()

    return multisig.isMultisigInitialized()
  }, [initMultisigWallet])

  const isWalletAssetConnected = useCallback(
    (asset: Asset) => {
      if (!address) return false
      return asset.L1Chain === Chain.THORChain
    },
    [address],
  )

  return {
    ...multisigActions,
    initMultisigWallet,
    createTransferTx,
    createDepositTx,
    importTx,
    signTx,
    broadcastTx,
    loadBalances,
    getPubkeyForAddress,
    getSortedSigners,
    isMultsigActivated,
    isWalletAssetConnected,
    isConnected: !!address,
  }
}
