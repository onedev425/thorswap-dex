import {
  useCallback,
  useMemo,
  useState,
  useEffect,
  ReactNode,
  KeyboardEventHandler,
} from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal, Typography } from 'components/Atomic'
import { PasswordInput } from 'components/PasswordInput'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

import { isKeystoreSignRequired } from 'helpers/wallet'

type Props = {
  inputAssets: Asset[]
  isOpened: boolean
  onClose: () => void
  onConfirm: () => void
  children?: ReactNode
}

const MODAL_CLOSE_DELAY = 60 * 1000

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

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isOpened) {
      timeout = setTimeout(() => {
        onClose()
      }, MODAL_CLOSE_DELAY)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isOpened, onClose])
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
    if (!password) return setInvalidPassword(true)

    setValidating(true)
    try {
      const isValid = await multichain().validateKeystore(keystore, password)

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

  const onPasswordKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      if (event.code === 'Enter' && !validating) {
        handleClickConfirm()
      }
    },
    [handleClickConfirm, validating],
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
          <>
            <PasswordInput
              value={password}
              onChange={({ target }) => setPassword(target.value)}
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
