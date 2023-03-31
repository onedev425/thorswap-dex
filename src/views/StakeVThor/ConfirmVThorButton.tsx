import { Chain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { getV2Address } from 'helpers/assets';
import { memo, useCallback, useEffect, useState } from 'react';
import { fromWei } from 'services/contract';
import { t } from 'services/i18n';
import { getSwapKitClient } from 'services/swapKit';
import { useWallet } from 'store/wallet/hooks';
import { StakeActions } from 'views/StakeVThor/types';
import { useVthorUtil } from 'views/StakeVThor/useVthorUtil';
import { VestingType } from 'views/Vesting/types';

type Props = {
  action: StakeActions;
  handleVthorAction: () => void;
  emptyInput: boolean;
  setIsConnectModalOpen: (isOpen: boolean) => void;
  ethAddress?: string;
};

export const ConfirmVThorButton = memo(
  ({ action, handleVthorAction, ethAddress, setIsConnectModalOpen, emptyInput }: Props) => {
    const { wallet } = useWallet();
    const [isApproved, setIsApproved] = useState(false);
    const { vthorBalance, approveTHOR } = useVthorUtil();

    const checkOnApprove = useCallback(async () => {
      const skClient = await getSwapKitClient();
      const ethWalletMethods = skClient.connectedWallets[Chain.Ethereum];
      if (!ethWalletMethods || !wallet?.ETH?.address) return;

      const isApproved = await ethWalletMethods?.isApproved?.({
        from: wallet?.ETH?.address,
        spenderAddress: getV2Address(VestingType.VTHOR),
        assetAddress: getV2Address(VestingType.THOR),
      });

      setIsApproved(!!isApproved);
    }, [wallet?.ETH?.address]);

    useEffect(() => {
      checkOnApprove();
    }, [checkOnApprove]);

    return (
      <Box className="self-stretch pt-5">
        {ethAddress ? (
          <Box className="w-full">
            {action === StakeActions.Deposit ? (
              <>
                {isApproved ? (
                  <Button
                    stretch
                    disabled={emptyInput}
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
