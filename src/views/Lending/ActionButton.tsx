import { Box, Button } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  disabled?: boolean;
  loading?: boolean;
  handleSubmit: () => void;
  setIsConnectModalOpen: (isOpen: boolean) => void;
  address?: string;
  label: string;
};

export const ActionButton = memo(
  ({ loading, label, disabled, handleSubmit, address, setIsConnectModalOpen }: Props) => (
    <Box className="self-stretch pt-5">
      {address ? (
        <Box className="w-full">
          <Button
            stretch
            disabled={disabled}
            loading={loading}
            onClick={handleSubmit}
            size="lg"
            variant="fancy"
          >
            {label}
          </Button>
        </Box>
      ) : (
        <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
          {t('common.connectWallet')}
        </Button>
      )}
    </Box>
  ),
);
