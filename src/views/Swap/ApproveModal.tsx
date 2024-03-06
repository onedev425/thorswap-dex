import type { AssetValue } from '@swapkit/core';
import { InfoTable } from 'components/InfoTable';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { useApproveInfoItems } from 'components/Modals/ConfirmModal/useApproveInfoItems';
import { memo, useCallback, useState } from 'react';
import { ApproveAmountSlider } from 'views/Swap/ApproveAmountSlider';

type Props = {
  balance?: AssetValue;
  handleApprove: (approveAmount?: string) => Promise<void>;
  inputAsset: AssetValue;
  setVisible: (visible: boolean) => void;
  totalFee?: string;
  visible: boolean;
};

export const ApproveModal = memo(
  ({ balance, inputAsset, handleApprove, setVisible, totalFee, visible }: Props) => {
    const [approveAmount, setApproveAmount] = useState<string | undefined>();
    const handleConfirmApprove = useCallback(() => {
      setVisible(false);
      handleApprove(approveAmount);
    }, [approveAmount, handleApprove, setVisible]);

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

        {balance?.getValue('number') ? (
          <ApproveAmountSlider balance={balance} setApproveAmount={setApproveAmount} />
        ) : null}
      </ConfirmModal>
    );
  },
);
