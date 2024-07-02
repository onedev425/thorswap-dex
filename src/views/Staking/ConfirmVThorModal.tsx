import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box, Icon } from "components/Atomic";
import { ChainBadge } from "components/ChainBadge";
import { ConfirmModal } from "components/Modals/ConfirmModal";
import { useCallback } from "react";

type Props = {
  stakingAsset: AssetValue;
  outputAsset: AssetValue;
  isOpened: boolean;
  closeModal: () => void;
  handleAction: () => void;
  outputAmount: string;
};

export const ConfirmVThorModal = ({
  outputAmount,
  stakingAsset,
  handleAction,
  closeModal,
  isOpened,
  outputAsset,
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
                {stakingAsset.toSignificant(6)} {stakingAsset.ticker}
              </Text>
            </Box>
          </Box>

          <Icon className="mx-2 -rotate-90" name="arrowDown" />

          <Box center col className="flex-1 p-4 rounded-2xl">
            <AssetIcon asset={outputAsset} />
            <Box center className="pt-2">
              <ChainBadge asset={outputAsset} />
            </Box>
            <Box center className="w-full">
              <Text fontWeight="medium" textStyle="caption">
                {outputAmount} {outputAsset.ticker}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </ConfirmModal>
  );
};
