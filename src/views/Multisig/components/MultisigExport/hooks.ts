import { useCallback } from 'react'

import { showErrorToast } from 'components/Toast'

import { useAppSelector } from 'store/store'

import { t } from 'services/i18n'

import { downloadAsFile } from 'helpers/download'

const MULTISIG_FILE_NAME = 'thorsafe-multisig.json'

export const useMultisigExport = () => {
  const { members, treshold, address } = useAppSelector(
    (state) => state.multisig,
  )

  const hasWallet = !!address

  const handleExport = useCallback(async () => {
    try {
      const walletData = { members, treshold }
      await downloadAsFile(MULTISIG_FILE_NAME, JSON.stringify(walletData))
    } catch (error: ErrorType) {
      const message = error.message || t('views.multisig.exportError')
      showErrorToast(message)
    }
  }, [members, treshold])

  return { hasWallet, handleExport }
}
