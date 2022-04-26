import { useCallback, useMemo, useState, useEffect, ReactNode } from 'react'

import { Asset, isKeystoreSignRequired } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal, Typography } from 'components/Atomic'
import { PasswordInput } from 'components/PasswordInput'

import { useWallet } from 'store/wallet/hooks'

import useTimeout from 'hooks/useTimeout'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

const MODAL_DISMISS_TIME = 60 * 1000 // 60s

type Props = {
  inputAssets: Asset[]
  isOpened: boolean
  onClose: () => void
  onConfirm: () => void
  children?: ReactNode
}

export const ConfirmModal = ({
  isOpened,
  inputAssets,
  onConfirm,
  onClose,
  children,
}: Props) => {
  const { keystore, wallet } = useWallet()
  const [invalidPassword, setInvalidPassword] = useState(false)
  const [validating, setValidating] = useState(false)

  const [password, setPassword] = useState('')

  // check if keystore wallet is connected for input assets
  const isKeystoreSigningRequired = useMemo(
    () => isKeystoreSignRequired({ wallet, inputAssets }),
    [wallet, inputAssets],
  )

  // dismiss modal after 60s
  useTimeout(() => {
    onClose()
  }, MODAL_DISMISS_TIME)

  // reset password on visible update
  useEffect(() => {
    setPassword('')
    setInvalidPassword(false)
    setValidating(false)
  }, [isOpened])

  // handler after password is verified
  const handleProceed = useCallback(() => {
    if (!onConfirm || !isOpened) {
      return
    }

    onConfirm()
  }, [onConfirm, isOpened])

  const handleCancel = useCallback(() => {
    if (onClose) {
      setPassword('')
      setInvalidPassword(false)
      setValidating(false)
      onClose()
    }
  }, [onClose])

  const handleClickConfirm = useCallback(async () => {
    if (!isKeystoreSigningRequired) {
      handleProceed()
      return
    }

    if (!keystore) return
    setValidating(true)

    try {
      const isValid = await multichain.validateKeystore(keystore, password)

      if (isValid) {
        handleProceed()
      } else {
        setInvalidPassword(true)
      }
    } catch (error) {
      setInvalidPassword(true)
    }

    setValidating(false)
  }, [keystore, password, handleProceed, isKeystoreSigningRequired])

  const onPasswordKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleClickConfirm()
      }
    },
    [handleClickConfirm],
  )

  const renderKeystoreSignMode = useMemo(
    () => (
      <>
        <PasswordInput
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onKeyDown={onPasswordKeyDown}
        />
        {invalidPassword && (
          <Typography
            className="ml-2"
            color="orange"
            variant="caption"
            fontWeight="medium"
          >
            {t('views.walletModal.wrongPassword')}
          </Typography>
        )}

        <Button
          size="md"
          isFancy
          stretch
          onClick={handleClickConfirm}
          loading={validating}
        >
          {t('common.confirm')}
        </Button>
      </>
    ),
    [
      password,
      invalidPassword,
      validating,
      handleClickConfirm,
      onPasswordKeyDown,
    ],
  )

  return (
    <Modal
      title={t('common.confirm')}
      isOpened={isOpened}
      onClose={handleCancel}
    >
      <Box className="gap-y-4 md:!min-w-[350px]" col>
        {children && <div>{children}</div>}
        {isKeystoreSigningRequired ? (
          renderKeystoreSignMode
        ) : (
          <Button
            size="md"
            isFancy
            stretch
            onClick={handleProceed}
            loading={validating}
          >
            {t('common.confirm')}
          </Button>
        )}
      </Box>
    </Modal>
  )
}
