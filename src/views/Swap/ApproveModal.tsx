import type { AssetValue } from '@swapkit/core';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { memo, useCallback } from 'react';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  inputAsset: AssetValue;
  totalFee?: string;
  handleApprove: () => Promise<void>;
};

export const ApproveModal = memo(
  ({ inputAsset, handleApprove, setVisible, totalFee, visible }: Props) => {
    const handleConfirmApprove = useCallback(() => {
      setVisible(false);

      handleApprove();
    }, [handleApprove, setVisible]);

    const approveConfirmInfo = useApproveInfoItems({
      assetName: inputAsset.ticker,
      assetValue: inputAsset.toString(),
      fee: totalFee,
    });

    return (
      <ConfirmModal
        inputAssets={[inputAsset]}
        isOpened={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirmApprove}
      >
        <InfoTable items={approveConfirmInfo} />
      </ConfirmModal>
    );
  },
);
