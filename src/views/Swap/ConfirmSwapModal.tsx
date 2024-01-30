import type { AssetInputType } from 'components/AssetInput/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useWallet } from 'context/wallet/hooks';
import { memo, useCallback, useMemo, useState } from 'react';
import { useAppSelector } from 'store/store';
import { useLazyGetAddressVerifyQuery } from 'store/thorswap/api';

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
  slippagePercent: number;
  handleSwap: () => Promise<void>;
  totalFee: string;
  visible: boolean;
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
    slippagePercent,
    totalFee,
    visible,
    streamSwap,
    selectedRoute,
  }: Props) => {
    const [fetchAddressVerify] = useLazyGetAddressVerifyQuery();
    const { getWalletAddress } = useWallet();

    const [addressesVerified, setAddressesVerified] = useState(true);
    const slippageTolerance = useAppSelector(({ app }) => app.slippageTolerance);
    const slipHigherThanTolerance = useMemo(
      () => slippagePercent > slippageTolerance,
      [slippagePercent, slippageTolerance],
    );
    const [confirmedSlippage, setConfirmedSlippage] = useState(false);

    const { asset: inputAsset } = inputAssetProps;
    const { asset: outputAsset } = outputAssetProps;

    const from = useMemo(
      () => getWalletAddress(inputAsset.chain),
      [getWalletAddress, inputAsset.chain],
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
        chains: [inputAsset.chain, outputAsset.chain],
      });

      const { list } = await import('./addressList');

      if (data?.confirm && !addresses.some((address) => list.includes(address))) {
        setVisible(false);
        handleSwap();
      } else {
        setAddressesVerified(false);
      }
    }, [
      setVisible,
      handleSwap,
      addresses,
      fetchAddressVerify,
      inputAsset.chain,
      outputAsset.chain,
    ]);

    const estimatedInfo = useMemo(() => {
      if (!estimatedTime) return '<5s';
      if (estimatedTime < 60) return `<${estimatedTime}s`;
      return `<${Math.ceil(estimatedTime / 60)}m`;
    }, [estimatedTime]);

    return (
      <ConfirmModal
        buttonDisabled={!addressesVerified || (slipHigherThanTolerance && !confirmedSlippage)}
        inputAssets={[inputAsset]}
        isOpened={visible}
        onClose={() => setVisible(false)}
        onConfirm={handleConfirm}
      >
        <ConfirmContent
          affiliateFee={affiliateFee}
          confirmedSlippage={confirmedSlippage}
          estimatedTime={estimatedInfo}
          feeAssets={feeAssets}
          inputAsset={inputAssetProps}
          minReceive={minReceive}
          outputAsset={outputAssetProps}
          recipient={recipient}
          setConfirmedSlippage={setConfirmedSlippage}
          slipHigherThanTolerance={slipHigherThanTolerance}
          slippagePercent={slippagePercent}
          streamSwap={streamSwap}
          swapMemo={memo}
          totalFee={totalFee}
        />
      </ConfirmModal>
    );
  },
);
