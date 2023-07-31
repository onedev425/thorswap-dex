import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Icon } from 'components/Atomic';
import { ChainBadge } from 'components/ChainBadge';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { toOptionalFixed } from 'helpers/number';
import { useCallback } from 'react';

type Props = {
  stakingAsset: AssetEntity;
  isOpened: boolean;
  closeModal: () => void;
  handleAction: () => void;
  inputAmount: Amount;
  outputAmount: number;
};

export const ConfirmVThorModal = ({
  inputAmount,
  outputAmount,
  stakingAsset,
  handleAction,
  closeModal,
  isOpened,
}: Props) => {
  const handleConfirm = useCallback(() => {
    closeModal();
    handleAction();
  }, [closeModal, handleAction]);

  return (
    <ConfirmModal
      inputAssets={[stakingAsset]}
      isOpened={isOpened}
      onClose={closeModal}
      onConfirm={handleConfirm}
    >
      <Box className="w-full">
        <Box alignCenter row className="w-full" justify="between">
          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={stakingAsset} />
            <Box center className="pt-2">
              <ChainBadge asset={stakingAsset} />
            </Box>
            <Box center className="w-full">
              <Text fontWeight="medium" textStyle="caption">
                {toOptionalFixed(inputAmount.assetAmount.toNumber())} {stakingAsset.ticker}
              </Text>
            </Box>
          </Box>
          <Icon className="mx-2 -rotate-90" name="arrowDown" />
          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={stakingAsset} />
            <Box center className="pt-2">
              <ChainBadge asset={stakingAsset} />
            </Box>
            <Box center className="w-full">
              <Text fontWeight="medium" textStyle="caption">
                {toOptionalFixed(outputAmount)} {stakingAsset.ticker}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </ConfirmModal>
  );
};
