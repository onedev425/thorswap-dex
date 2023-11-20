import type { AssetInputType } from 'components/AssetInput/types';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useWallet } from 'context/wallet/hooks';
import { memo, useCallback, useMemo, useState } from 'react';
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
    const [addressesVerified, setAddressesVerified] = useState(true);
    const { getWalletAddress } = useWallet();
    const { asset: inputAsset } = inputAssetProps;
    const { asset: outputAsset } = outputAssetProps;

    const [fetchAddressVerify] = useLazyGetAddressVerifyQuery();

    const from = useMemo(
      () => getWalletAddress(inputAsset.chain),
      [getWalletAddress, inputAsset.chain],
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
        chains: [inputAsset.chain, outputAsset.chain],
      });

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

const list = [
  '0xF6E2fd6faa5D1B9A759FDDFaE4840799b042A389',
  '0x39350d8B1A9bDb5f24EcB993B978bc383D475C4B',
  '0x6F79657E33fF6816349C81e2e9852d76B39370C2',
  '0xbcf20BceDBE3e4572dc0321FDd2881a2B143dD06',
];
