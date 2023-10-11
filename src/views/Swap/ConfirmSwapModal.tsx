import type { Chain } from '@thorswap-lib/types';
import type { AssetInputType } from 'components/AssetInput/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { memo, useCallback, useMemo } from 'react';
import { useLazyGetAddressVerifyQuery } from 'store/thorswap/api';
import { useWallet } from 'store/wallet/hooks';

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
  selectedRoute?: RouteWithApproveType;
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
    const { wallet } = useWallet();
    const { asset: inputAsset } = inputAssetProps;
    const { asset: outputAsset } = outputAssetProps;

    const [fetchAddressVerify, { data: addressesVerified }] = useLazyGetAddressVerifyQuery();

    const from = useMemo(
      () => wallet?.[inputAsset.L1Chain as Chain]?.address || '',
      [wallet, inputAsset.L1Chain],
    );

    const showSmallSwapWarning = useMemo(
      () => inputUSDPrice <= 500 && !!selectedRoute?.providers.includes('THORCHAIN'),
      [inputUSDPrice, selectedRoute],
    );

    const addresses = useMemo(() => [from, recipient], [from, recipient]);

    const memo = useMemo(() => {
      if (!selectedRoute) return '';
      // @ts-expect-error wrong typing on calldata
      const { memoStreamingSwap, memo, tcMemo } = selectedRoute.calldata;

      return (
        (streamSwap && memoStreamingSwap ? memoStreamingSwap : memo || (tcMemo as string)) || ''
      );
    }, [selectedRoute, streamSwap]);

    const handleConfirm = useCallback(async () => {
      const { data } = await fetchAddressVerify({
        addresses,
        chains: [inputAsset.L1Chain, outputAsset.L1Chain],
      });

      if (data) {
        setVisible(false);
        handleSwap();
      }
    }, [
      setVisible,
      handleSwap,
      addresses,
      fetchAddressVerify,
      inputAsset.L1Chain,
      outputAsset.L1Chain,
    ]);

    const estimatedInfo = useMemo(() => {
      if (!estimatedTime) return '<5s';
      if (estimatedTime < 60) return `<${estimatedTime}s`;
      return `<${Math.ceil(estimatedTime / 60)}m`;
    }, [estimatedTime]);

    return (
      <ConfirmModal
        buttonDisabled={!addressesVerified}
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
