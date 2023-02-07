import { Box, Button } from 'components/Atomic';
import { memo } from 'react';
import { fromWei } from 'services/contract';
import { t } from 'services/i18n';
import { useWallet } from 'store/wallet/hooks';
import { StakeActions } from 'views/StakeVThor/types';
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil';

type Props = {
  action: StakeActions;
  handleVthorAction: () => void;
  emptyInput: boolean;
  setIsConnectModalOpen: (isOpen: boolean) => void;
  ethAddress?: string;
};

export const ConfirmVThorButton = memo(
  ({ action, handleVthorAction, ethAddress, setIsConnectModalOpen, emptyInput }: Props) => {
    const { vthorBalance, approveTHOR } = useVthorUtil();
    const { isVthorApproved } = useWallet();

    return (
      <Box className="self-stretch pt-5">
        {ethAddress ? (
          <Box className="w-full">
            {action === StakeActions.Deposit ? (
              <>
                {isVthorApproved ? (
                  <Button
                    stretch
                    disabled={emptyInput}
                    loading={false}
                    onClick={handleVthorAction}
                    size="lg"
                    variant="fancy"
                  >
                    {t('txManager.stake')}
                  </Button>
                ) : (
                  <Button stretch loading={false} onClick={approveTHOR} size="lg" variant="fancy">
                    {t('txManager.approve')}
                  </Button>
                )}
              </>
            ) : (
              <Button
                stretch
                disabled={emptyInput || fromWei(vthorBalance) === 0}
                onClick={handleVthorAction}
                size="lg"
                variant="fancy"
              >
                {t('views.stakingVThor.unstake')}
              </Button>
            )}
          </Box>
        ) : (
          <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
            {t('common.connectWallet')}
          </Button>
        )}
      </Box>
    );
  },
);
