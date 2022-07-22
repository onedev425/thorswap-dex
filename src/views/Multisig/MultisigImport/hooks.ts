import { useCallback, useState } from 'react'

import { showErrorToast } from 'components/Toast'

import { useMultisig } from 'store/multisig/hooks'
import { MultisigMember } from 'store/multisig/types'

import { t } from 'services/i18n'
import { multisig } from 'services/multisig'

type WalletData = {
  treshold: number
  members: MultisigMember[]
}

type Props = {
  onSuccess: () => void
}

export const useMultisigImport = ({ onSuccess }: Props) => {
  const [fileError, setFileError] = useState('')
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [name, setName] = useState('')
  const { addMultisigWallet } = useMultisig()

  const parseData = useCallback((data: WalletData) => {
    if (
      !data.members ||
      !Array.isArray(data.members) ||
      data.members.some((m) => !m.pubKey)
    ) {
      throw Error('Incorrect wallet members')
    }

    if (
      typeof data.treshold !== 'number' ||
      data.treshold > data.members.length
    ) {
      throw Error('Incorrect treshold')
    }

    const parsedData: WalletData = {
      treshold: data.treshold,
      members: data.members.map((m) => ({
        pubKey: m.pubKey,
        name: m.name || '',
      })),
    }

    return parsedData
  }, [])

  const onChangeFile = useCallback(
    (file: Blob) => {
      const reader = new FileReader()
      const onLoadHandler = () => {
        try {
          setFileError('')
          const rawData = JSON.parse(reader.result as string)
          const data = parseData(rawData)
          setWalletData(data)
        } catch (e: ErrorType) {
          setFileError(t('views.multisig.jsonError'))
          setWalletData(null)
        }
      }

      reader.addEventListener('load', onLoadHandler)
      reader.readAsText(file)
      return () => {
        reader.removeEventListener('load', onLoadHandler)
      }
    },
    [parseData],
  )

  const onError = useCallback((error: Error) => {
    setFileError(`${t('views.multisig.selectingKeyError')}: ${error}`)
    setWalletData(null)
  }, [])

  const handleConnectWallet = useCallback(() => {
    if (!walletData) {
      return
    }

    try {
      const { members, treshold } = walletData
      const address = multisig.createMultisigWallet(members, treshold)

      if (!address) {
        throw Error('Incorrect wallet data')
      }

      addMultisigWallet({ members, treshold, address, name })
      onSuccess()
    } catch (e: ErrorType) {
      showErrorToast('')
    }
  }, [addMultisigWallet, name, onSuccess, walletData])

  return {
    onChangeFile,
    fileError,
    setFileError,
    onError,
    name,
    setName,
    useCallback,
    handleConnectWallet,
    isValid: !!walletData && !fileError,
    walletData,
  }
}
