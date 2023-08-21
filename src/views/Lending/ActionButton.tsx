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
  hasError?: boolean;
};

export const ActionButton = memo(
  ({ loading, label, disabled, handleSubmit, address, setIsConnectModalOpen, hasError }: Props) => (
    <Box className="self-stretch pt-5">
      {address ? (
        <Box className="w-full">
          <Button
            stretch
            disabled={disabled}
            error={hasError}
            loading={loading}
            onClick={handleSubmit}
            size="lg"
            variant="fancy"
          >
            {label}
          </Button>
        </Box>
      ) : (
        <Button
          stretch
          loading={loading}
          onClick={() => setIsConnectModalOpen(true)}
          size="lg"
          variant="fancy"
        >
          {t('common.connectWallet')}
        </Button>
      )}
    </Box>
  ),
);
