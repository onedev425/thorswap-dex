import { useCallback, ReactNode, useEffect } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Modal } from 'components/Atomic'

import { t } from 'services/i18n'

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
  onConfirm,
  onClose,
  children,
}: Props) => {
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
