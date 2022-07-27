import { useCallback, ReactNode } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal } from 'components/Atomic'

import useTimeout from 'hooks/useTimeout'

import { t } from 'services/i18n'

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
  onConfirm,
  onClose,
  children,
}: Props) => {
  useTimeout(() => {
    onClose()
  }, MODAL_DISMISS_TIME)

  const handleProceed = useCallback(() => {
    if (!onConfirm || !isOpened) {
      return
    }
    onConfirm()
  }, [onConfirm, isOpened])

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  return (
    <Modal
      title={t('common.confirm')}
      isOpened={isOpened}
      onClose={handleCancel}
    >
      <Box className="gap-y-4 md:!min-w-[350px]" col>
        {children && <div>{children}</div>}

        <Button size="md" isFancy stretch onClick={handleProceed}>
          {t('common.confirm')}
        </Button>
      </Box>
    </Modal>
  )
}
