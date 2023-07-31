import { MaxInt256 } from '@ethersproject/constants';
import { parseUnits } from '@ethersproject/units';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { stakingV2Addr } from 'helpers/assets';
import { memo, useCallback, useEffect, useState } from 'react';
import { fromWei } from 'services/contract';
import { t } from 'services/i18n';
import { getSwapKitClient } from 'services/swapKit';
import { VestingType } from 'views/Vesting/types';

import { StakeActions, useVthorUtil } from './hooks';

type Props = {
  action: StakeActions;
  handleVthorAction: () => void;
  emptyInput: boolean;
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
    emptyInput,
    inputAmount,
  }: Props) => {
    const [isApproved, setIsApproved] = useState(false);
    const { vthorBalance, approveTHOR } = useVthorUtil();

    const checkOnApprove = useCallback(async () => {
      const skClient = await getSwapKitClient();
      const ethWalletMethods = skClient.connectedWallets[Chain.Ethereum];
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
