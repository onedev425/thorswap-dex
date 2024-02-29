import type { AssetValue, ChainWallet } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import { Box, Button } from 'components/Atomic';
import { MaxInt256 } from 'ethers';
import { stakingV2Addr } from 'helpers/assets';
import { memo, useCallback, useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { VestingType } from 'views/Vesting/types';

import { StakeActions, useVthorUtil } from './hooks';

type Props = {
  action: StakeActions;
  assetValue: AssetValue;
  disabledButton: boolean;
  ethAddress?: string;
  handleVthorAction: () => void;
  setIsConnectModalOpen: (isOpen: boolean) => void;
};

export const ConfirmVThorButton = memo(
  ({
    action,
    assetValue,
    disabledButton,
    ethAddress,
    handleVthorAction,
    setIsConnectModalOpen,
  }: Props) => {
    const [isApproved, setIsApproved] = useState(false);
    const { approveTHOR } = useVthorUtil();

    const checkOnApprove = useCallback(async () => {
      const { getWallet } = await (await import('services/swapKit')).getSwapKitClient();
      const ethWalletMethods = getWallet(Chain.Ethereum) as ChainWallet<Chain.Ethereum>;
      if (!ethWalletMethods || !ethAddress) return;

      const isApproved = await ethWalletMethods?.isApproved?.({
        from: ethAddress,
        spenderAddress: stakingV2Addr[VestingType.VTHOR],
        assetAddress: stakingV2Addr[VestingType.THOR],
        amount: assetValue.bigIntValue || MaxInt256,
      });

      setIsApproved(!!isApproved);
    }, [assetValue.bigIntValue, ethAddress]);

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
