import { Amount, Asset } from '@thorswap-lib/multichain-sdk';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { memo, useCallback } from 'react';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  inputAsset: Asset;
  inputAmount: Amount;
  totalFee: string;
  handleApprove: () => Promise<void>;
};

export const ApproveModal = memo(
  ({ inputAsset, handleApprove, setVisible, totalFee, visible, inputAmount }: Props) => {
    const handleConfirmApprove = useCallback(() => {
      setVisible(false);

      handleApprove();
    }, [handleApprove, setVisible]);

    const approveConfirmInfo = useApproveInfoItems({
      assetName: inputAsset.name,
      assetValue: inputAmount.toSignificant(6),
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
