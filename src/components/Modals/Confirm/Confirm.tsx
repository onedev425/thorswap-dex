import { Text } from '@chakra-ui/react';
import { Box, Button, Modal } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  isOpened: boolean;
  description: string;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

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
    <Modal isOpened={isOpened} onClose={onCancel} title={title || ''}>
      <Box col>
        <Text>{description}</Text>
        <Box className="gap-3 mt-4" justify="end">
          <Button onClick={onCancel} variant="tint">
            {cancelLabel || t('common.cancel')}
          </Button>
          <Button onClick={onConfirm} variant="primary">
            {confirmLabel || t('common.confirm')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
