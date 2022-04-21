import { useCallback, useEffect, useState } from 'react'

import { FieldValues, useForm } from 'react-hook-form'

import copy from 'copy-to-clipboard'

import { showToast, ToastType } from 'components/Toast'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

// TODO(@Chillios)
export const usePhraseModal = (isOpen: boolean) => {
  const { keystore } = useWallet()
  const {
    register,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm()

  const [showPhrase, setShowPhrase] = useState(false)
  const passwordField = register('password', { required: true })

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setShowPhrase(false)
        reset({ password: '' })
      }, 300)
    }
  }, [isOpen, reset])

  const handleConfirm = useCallback(
    async ({ password }: FieldValues) => {
      if (!keystore) return

      try {
        const isValid = await multichain.validateKeystore(keystore, password)

        if (isValid) {
          setShowPhrase(true)
        } else {
          throw Error('Invalid password')
        }
      } catch (error) {
        setError('password', { type: 'value' })
      }
    },
    [keystore, setError],
  )

  const submit = handleSubmit(handleConfirm)

  const handleCopyPhrase = useCallback(() => {
    copy(multichain.getPhrase())
    showToast(
      { message: t('views.walletModal.phraseCopied') },
      ToastType.Success,
    )
  }, [])

  return {
    handleConfirm,
    showPhrase,
    errors,
    submit,
    passwordField,
    handleCopyPhrase,
  }
}
