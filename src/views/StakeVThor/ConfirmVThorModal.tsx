import { Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon } from 'components/Atomic';
import { ChainBadge } from 'components/ChainBadge';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { toOptionalFixed } from 'helpers/number';
import { useCallback } from 'react';
import { StakeActions, vThorAssets } from 'views/StakeVThor/types';

type Props = {
  action: StakeActions;
  isOpened: boolean;
  closeModal: () => void;
  handleAction: () => void;
  inputAmount: Amount;
  outputAmount: number;
};

export const ConfirmVThorModal = ({
  inputAmount,
  outputAmount,
  action,
  handleAction,
  closeModal,
  isOpened,
}: Props) => {
  const asset = action === StakeActions.Deposit ? vThorAssets.unstake : vThorAssets.deposit;

  const handleConfirm = useCallback(() => {
    closeModal();
    handleAction();
  }, [closeModal, handleAction]);

  return (
    <ConfirmModal
      inputAssets={[vThorAssets[action]]}
      isOpened={isOpened}
      onClose={closeModal}
      onConfirm={handleConfirm}
    >
      <Box className="w-full">
        <Box alignCenter row className="w-full" justify="between">
          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={vThorAssets[action]} />
            <Box center className="pt-2">
              <ChainBadge asset={vThorAssets[action]} />
            </Box>
            <Box center className="w-full">
              <Text fontWeight="medium" textStyle="caption">
                {toOptionalFixed(inputAmount.assetAmount.toNumber())} {vThorAssets[action].ticker}
              </Text>
            </Box>
          </Box>
          <Icon className="mx-2 -rotate-90" name="arrowDown" />
          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={asset} />
            <Box center className="pt-2">
              <ChainBadge asset={asset} />
            </Box>
            <Box center className="w-full">
              <Text fontWeight="medium" textStyle="caption">
                {toOptionalFixed(outputAmount)} {asset.ticker}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </ConfirmModal>
  );
};
