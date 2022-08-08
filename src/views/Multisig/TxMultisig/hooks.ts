import { useCallback, useMemo, useState } from 'react'

import { Chain } from '@thorswap-lib/xchain-util'

import { showErrorToast } from 'components/Toast'

import { useMultisig } from 'store/multisig/hooks'
import { MultisigMember } from 'store/multisig/types'
import { useAppSelector } from 'store/store'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { MultisigTx, Signer } from 'services/multisig'

export type ScreenState = {
  tx: MultisigTx
  signers: MultisigMember[]
}

export const useTxData = (state: ScreenState | null) => {
  const { treshold } = useAppSelector((state) => state.multisig)
  const { signTx, broadcastTx, getPubkeyForAddress, getSortedSigners } =
    useMultisig()
  const { wallet, setIsConnectModalOpen } = useWallet()
  const txData = useMemo(() => state?.tx || null, [state?.tx])
  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || ''

  const [signers, setSigners] = useState<Signer[]>([])
  const [broadcastedTxHash, setBroadcastedTxHash] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  const signature = JSON.stringify(txData, null, 2) || ''
  const canBroadcast = signers.length >= treshold

  const addSigner = useCallback(
    (signer: Signer) => {
      setSigners((prev) => {
        const idx = prev.findIndex((s) => s.pubKey === signer.pubKey)
        const updated = [...prev]

        if (idx > -1) {
          updated[idx] = signer
        } else {
          updated.push(signer)
        }

        return getSortedSigners(updated)
      })
    },
    [getSortedSigners],
  )

  const sign = useCallback(async () => {
    if (!connectedWalletAddress) {
      return
    }

    const pubKey = getPubkeyForAddress(connectedWalletAddress)
    if (!pubKey) {
      return showErrorToast(t('views.multisig.incorrectSigner'))
    }
    const signature = await signTx(JSON.stringify(txData))
    if (signature === undefined)
      throw Error(`Unable to sign: ${JSON.stringify(txData)}`)

    addSigner({ pubKey, signature })
  }, [addSigner, connectedWalletAddress, getPubkeyForAddress, signTx, txData])

  // TODO - get recipient and amount from tx
  const txInfo = useMemo(
    () => [
      { label: t('common.amount'), value: 'test amount' },
      { label: t('common.recipient'), value: 'test recipient' },
    ],
    [],
  )

  const handleSign = useCallback(() => {
    if (!connectedWalletAddress) {
      setIsConnectModalOpen(true)
      return
    }

    sign()
  }, [connectedWalletAddress, setIsConnectModalOpen, sign])

  const handleBroadcast = useCallback(async () => {
    setIsBroadcasting(true)
    const txHash = await broadcastTx(JSON.stringify(txData), signers)
    setIsBroadcasting(false)
    if (txHash) {
      setBroadcastedTxHash(txHash)
      // TODO - Add tx to TxManager
    }
  }, [broadcastTx, signers, txData])

  return {
    signature,
    txInfo,
    signers,
    addSigner,
    txData,
    canBroadcast,
    handleSign,
    handleBroadcast,
    isBroadcasting,
    broadcastedTxHash,
  }
}
