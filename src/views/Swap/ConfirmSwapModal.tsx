import { AssetInputType } from 'components/AssetInput/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { memo, useCallback, useMemo } from 'react';

import { ConfirmContent } from './ConfirmContent';

type Props = {
  estimatedTime?: number;
  affiliateFee: string;
  feeAssets: string;
  inputAssetProps: AssetInputType;
  minReceive: string;
  outputAssetProps: AssetInputType;
  recipient: string;
  setVisible: (visible: boolean) => void;
  slippageInfo: string;
  handleSwap: () => Promise<void>;
  totalFee: string;
  visible: boolean;
};

export const ConfirmSwapModal = memo(
  ({
    affiliateFee,
    feeAssets,
    handleSwap,
    inputAssetProps,
    minReceive,
    outputAssetProps,
    recipient,
    setVisible,
    slippageInfo,
    totalFee,
    visible,
    estimatedTime,
  }: Props) => {
    const { asset: inputAsset } = inputAssetProps;

    const handleConfirm = useCallback(async () => {
      setVisible(false);
      handleSwap();
    }, [setVisible, handleSwap]);

    const estimatedInfo = useMemo(() => {
      if (!estimatedTime) return '<5s';
      if (estimatedTime < 60) return `<${estimatedTime}s`;
      return `<${Math.ceil(estimatedTime / 60)}m`;
    }, [estimatedTime]);

    return (
      <ConfirmModal
        inputAssets={[inputAsset]}
        isOpened={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      >
        <ConfirmContent
          affiliateFee={affiliateFee}
          estimatedTime={estimatedInfo}
          feeAssets={feeAssets}
          inputAsset={inputAssetProps}
          minReceive={minReceive}
          outputAsset={outputAssetProps}
          recipient={recipient}
          slippageInfo={slippageInfo}
          totalFee={totalFee}
        />
      </ConfirmModal>
    );
  },
);
