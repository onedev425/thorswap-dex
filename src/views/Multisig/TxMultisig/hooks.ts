import { useCallback, useMemo, useState } from 'react'

import { Chain } from '@thorswap-lib/types'

import { showErrorToast } from 'components/Toast'

import { useMultisig } from 'store/multisig/hooks'
import { MultisigMember } from 'store/multisig/types'
import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { ImportedMultisigTx, MultisigTx, Signer } from 'services/multisig'

export type ScreenState = {
  tx: MultisigTx
  signers: MultisigMember[]
  signatures?: Signer[]
}

export const useTxData = (state: ScreenState | null) => {
  const { signTx, broadcastTx, getPubkeyForAddress, getSortedSigners } =
    useMultisig()
  const { wallet } = useWallet()
  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || ''
  const txData = useMemo(() => state?.tx || null, [state?.tx])
  const requiredSigners = useMemo(() => state?.signers || [], [state?.signers])

  const [signatures, setSignatures] = useState<Signer[]>(
    state?.signatures || [],
  )
  const [broadcastedTxHash, setBroadcastedTxHash] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)

  const txBodyStr = JSON.stringify(txData, null, 2) || ''
  const canBroadcast = signatures.length >= requiredSigners.length

  const pubKey = useMemo(() => {
    if (!connectedWalletAddress) {
      return ''
    }

    try {
      return getPubkeyForAddress(connectedWalletAddress)
    } catch (e) {
      return ''
    }
  }, [connectedWalletAddress, getPubkeyForAddress])

  const connectedSignature = useMemo(() => {
    if (!pubKey) {
      return null
    }

    return signatures.find((s) => s.pubKey === pubKey) || null
  }, [pubKey, signatures])

  const exportTxData: ImportedMultisigTx | null = useMemo(() => {
    if (!txData) {
      return null
    }

    return {
      txBody: txData,
      signers: requiredSigners,
      signatures,
    }
  }, [requiredSigners, signatures, txData])

  const addSigner = useCallback(
    (signer: Signer) => {
      setSignatures((prev) => {
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
    if (!pubKey || !requiredSigners.find((s) => s.pubKey === pubKey)) {
      return showErrorToast(t('views.multisig.incorrectSigner'))
    }

    const signature = await signTx(JSON.stringify(txData))
    if (signature === undefined)
      throw Error(`Unable to sign: ${JSON.stringify(txData)}`)

    addSigner({ pubKey, signature })
  }, [addSigner, pubKey, requiredSigners, signTx, txData])

  // TODO - get recipient and amount from tx
  const txInfo = useMemo(
    () => [
      { label: t('common.amount'), value: 'test amount' },
      { label: t('common.recipient'), value: 'test recipient' },
    ],
    [],
  )

  const handleBroadcast = useCallback(async () => {
    setIsBroadcasting(true)
    const txHash = await broadcastTx(JSON.stringify(txData), signatures)
    setIsBroadcasting(false)
    if (txHash) {
      setBroadcastedTxHash(txHash)
      // TODO - Add tx to TxManager
    }
  }, [broadcastTx, signatures, txData])

  const hasMemberSignature = useCallback(
    (signer: MultisigMember) => {
      return !!signatures.find((s) => s.pubKey === signer.pubKey)
    },
    [signatures],
  )

  return {
    txBodyStr,
    txInfo,
    signatures,
    addSigner,
    txData,
    canBroadcast,
    handleBroadcast,
    isBroadcasting,
    broadcastedTxHash,
    requiredSigners,
    hasMemberSignature,
    connectedSignature,
    exportTxData,
    handleSign: sign,
  }
}
