import { AssetInputType } from 'components/AssetInput/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { shortenAddress } from 'helpers/shortenAddress';
import { memo, useCallback, useMemo } from 'react';

import { ConfirmContent } from './ConfirmContent';

type Props = {
  estimatedTime?: number;
  affiliateFee: string;
  feeAssets: string;
  inputAssetProps: AssetInputType;
  streamSwap: boolean;
  minReceive: string;
  outputAssetProps: AssetInputType;
  recipient: string;
  setVisible: (visible: boolean) => void;
  slippageInfo: string;
  handleSwap: () => Promise<void>;
  totalFee: string;
  visible: boolean;
  inputUSDPrice: number;
  selectedRoute: RouteWithApproveType;
};

export const ConfirmSwapModal = memo(
  ({
    affiliateFee,
    estimatedTime,
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
    streamSwap,
    inputUSDPrice,
    selectedRoute,
  }: Props) => {
    const { asset: inputAsset } = inputAssetProps;

    const showSmallSwapWarning = useMemo(
      () => inputUSDPrice <= 500 && selectedRoute?.providers.includes('THORCHAIN'),
      [inputUSDPrice, selectedRoute],
    );

    const memo = useMemo(() => {
      if (!selectedRoute) return '';
      // @ts-expect-error wrong typing on calldata
      const { memoStreamingSwap, memo, tcMemo } = selectedRoute.calldata;

      return shortenAddress(
        (streamSwap && memoStreamingSwap ? memoStreamingSwap : memo || tcMemo) || '',
        20,
      );
    }, [selectedRoute, streamSwap]);

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
          showSmallSwapWarning={showSmallSwapWarning}
          slippageInfo={slippageInfo}
          streamSwap={streamSwap}
          swapMemo={memo}
          totalFee={totalFee}
        />
      </ConfirmModal>
    );
  },
);
