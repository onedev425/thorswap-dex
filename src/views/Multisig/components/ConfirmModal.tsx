import { Box, Button, Modal } from 'components/Atomic';
import { ReactNode, useCallback, useEffect } from 'react';
import { t } from 'services/i18n';

type Props = {
  isOpened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  children?: ReactNode;
};

const MODAL_CLOSE_DELAY = 60 * 1000;

export const ConfirmModal = ({ isOpened, onConfirm, onClose, children }: Props) => {
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpened) {
      timeout = setTimeout(() => {
        onClose();
      }, MODAL_CLOSE_DELAY);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isOpened, onClose]);

  const handleProceed = useCallback(() => {
    if (!onConfirm || !isOpened) {
      return;
    }
    onConfirm();
  }, [onConfirm, isOpened]);

  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  return (
    <Modal isOpened={isOpened} onClose={handleCancel} title={t('common.confirm')}>
      <Box col className="gap-y-4 md:!min-w-[350px]">
        {children && <div>{children}</div>}

        <Button stretch onClick={handleProceed} size="md" variant="fancy">
          {t('common.confirm')}
        </Button>
      </Box>
    </Modal>
  );
};
