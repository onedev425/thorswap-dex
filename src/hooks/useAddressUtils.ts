import { useCallback, useMemo } from 'react'

import copy from 'copy-to-clipboard'

import { showToast, ToastType } from 'components/Toast'

import { t } from 'services/i18n'

export const useAddressUtils = (address: string) => {
  const miniAddress = useMemo(
    () => `${address.slice(0, 3)}...${address.slice(-3)}`,
    [address],
  )

  const handleCopyAddress = useCallback(() => {
    copy(address)
    showToast(t('common.addressCopied'), ToastType.Success)
  }, [address])

  return {
    miniAddress,
    handleCopyAddress,
  }
}
