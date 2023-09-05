import { MaxInt256 } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import type { Amount } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { stakingV2Addr } from 'helpers/assets';
import { memo, useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { VestingType } from 'views/Vesting/types';

import { StakeActions, useVthorUtil } from './hooks';

type Props = {
  action: StakeActions;
  handleVthorAction: () => void;
  disabledButton: boolean;
  inputAmount: Amount;
  setIsConnectModalOpen: (isOpen: boolean) => void;
  ethAddress?: string;
};

export const ConfirmVThorButton = memo(
  ({
    action,
    handleVthorAction,
    ethAddress,
    setIsConnectModalOpen,
    disabledButton,
    inputAmount,
  }: Props) => {
    const [isApproved, setIsApproved] = useState(false);
    const { approveTHOR } = useVthorUtil();

    const checkOnApprove = useCallback(async () => {
      const { connectedWallets } = await (await import('services/swapKit')).getSwapKitClient();
      const ethWalletMethods = connectedWallets[Chain.Ethereum];
      if (!ethWalletMethods || !ethAddress) return;

      const isApproved = await ethWalletMethods?.isApproved?.({
        from: ethAddress,
        spenderAddress: stakingV2Addr[VestingType.VTHOR],
        assetAddress: stakingV2Addr[VestingType.THOR],
        amount: parseUnits(inputAmount.assetAmount.toFixed(), 18) || MaxInt256,
      });

      setIsApproved(!!isApproved);
    }, [ethAddress, inputAmount]);

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
                    disabled={disabledButton}
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
                disabled={disabledButton}
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
