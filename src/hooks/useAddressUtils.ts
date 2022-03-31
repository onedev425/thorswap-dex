import { useCallback, useMemo } from 'react'

import copy from 'copy-to-clipboard'
import { shortenAddress } from 'utils/shortenAddress'

import { showToast, ToastType } from 'components/Toast'

import { t } from 'services/i18n'

export const useAddressUtils = (address: string) => {
  const miniAddress = useMemo(() => shortenAddress(address), [address])
  const shortAddress = useMemo(() => shortenAddress(address, 8, 5), [address])

  const handleCopyAddress = useCallback(() => {
    copy(address)
    showToast({ message: t('common.addressCopied') }, ToastType.Success)
  }, [address])

  return {
    miniAddress,
    shortAddress,
    handleCopyAddress,
  }
}
