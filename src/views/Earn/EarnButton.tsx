import { Box, Button, Icon } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';

type Props = {
  disabled?: boolean;
  loading?: boolean;
  handleSubmit: () => void;
  setIsConnectModalOpen: (isOpen: boolean) => void;
  address?: string;
  label: string;
  hardCapReached?: boolean;
};

export const EarnButton = memo(
  ({
    loading,
    hardCapReached,
    label,
    disabled,
    handleSubmit,
    address,
    setIsConnectModalOpen,
  }: Props) => (
    <Box className="self-stretch pt-5">
      {address ? (
        <Box className="w-full">
          <Button
            stretch
            disabled={disabled || hardCapReached}
            error={hardCapReached}
            loading={loading}
            onClick={handleSubmit}
            rightIcon={hardCapReached ? <Icon name="infoCircle" size={20} /> : undefined}
            size="lg"
            tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
            tooltipClasses="text-center mx-[-2px]"
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
