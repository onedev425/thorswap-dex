import { Box, Button, Modal, Typography } from 'components/Atomic'

import { t } from 'services/i18n'

type Props = {
  isOpened: boolean
  description: string
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const Confirm = ({
  isOpened,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <Modal title={title || ''} isOpened={isOpened} onClose={onCancel}>
      <Box col>
        <Typography>{description}</Typography>
        <Box className="gap-3" justify="end" mt={16}>
          <Button onClick={onCancel} variant="tint">
            {cancelLabel || t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} variant="primary">
            {confirmLabel || t('common.confirm')}
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
