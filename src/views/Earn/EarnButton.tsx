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

export const EarnButton = memo(
  ({ loading, label, disabled, handleSubmit, address, setIsConnectModalOpen }: Props) => (
    <Box className="self-stretch pt-5">
      {address ? (
        <Box className="w-full">
          <Button
            isFancy
            stretch
            disabled={disabled}
            loading={loading}
            onClick={handleSubmit}
            size="lg"
          >
            {label}
          </Button>
        </Box>
      ) : (
        <Button isFancy stretch onClick={() => setIsConnectModalOpen(true)} size="lg">
          {t('common.connectWallet')}
        </Button>
      )}
    </Box>
  ),
);
