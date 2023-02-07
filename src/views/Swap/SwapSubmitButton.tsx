import { Amount, Asset } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { hasWalletConnected } from 'helpers/wallet';
import { useCheckExchangeBNB } from 'hooks/useCheckExchangeBNB';
import { useMimir } from 'hooks/useMimir';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { useMidgard } from 'store/midgard/hooks';
import { useTransactionsState } from 'store/transactions/hooks';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  hasQuote: boolean;
  inputAmount: Amount;
  inputAsset: Asset;
  isApproved: boolean | null;
  isInputWalletConnected: boolean;
  isLoading: boolean;
  outputAsset: Asset;
  recipient: string | null;
  setVisibleApproveModal: (visible: boolean) => void;
  setVisibleConfirmModal: (visible: boolean) => void;
  swapAmountTooSmall: boolean;
};

export const SwapSubmitButton = ({
  hasQuote,
  inputAmount,
  inputAsset,
  isApproved,
  isInputWalletConnected,
  isLoading,
  outputAsset,
  recipient,
  setVisibleApproveModal,
  setVisibleConfirmModal,
  swapAmountTooSmall,
}: Props) => {
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { inboundHalted, pools } = useMidgard();
  const { isChainTradingHalted, maxSynthPerAssetDepth } = useMimir();
  const { getChainTradingPaused } = useExternalConfig();
  const { numberOfPendingApprovals } = useTransactionsState();

  const isSynthMintable = useMemo((): boolean => {
    if (!outputAsset.isSynth || !pools?.length) return true;
    const { assetDepth, synthSupply } =
      pools?.find((p) => p.asset.symbol === outputAsset.symbol)?.detail || {};

    const assetDepthAmount = Amount.fromMidgard(assetDepth);
    const synthSupplyAmount = Amount.fromMidgard(synthSupply);

    if (assetDepthAmount.eq(0)) return true;

    return synthSupplyAmount
      .div(assetDepthAmount)
      .assetAmount.isLessThan(maxSynthPerAssetDepth / 10000);
  }, [maxSynthPerAssetDepth, outputAsset.isSynth, outputAsset.symbol, pools]);

  const isTradingHalted: boolean = useMemo(() => {
    const inTradeHalted =
      inboundHalted[inputAsset.L1Chain as Chain] || isChainTradingHalted[inputAsset.L1Chain];
    const outTradeHated =
      inboundHalted[outputAsset.L1Chain as Chain] || isChainTradingHalted[outputAsset.L1Chain];

    return (
      inTradeHalted ||
      outTradeHated ||
      getChainTradingPaused(inputAsset.L1Chain as Chain) ||
      getChainTradingPaused(outputAsset.L1Chain as Chain) ||
      !isSynthMintable
    );
  }, [
    getChainTradingPaused,
    inboundHalted,
    inputAsset.L1Chain,
    isChainTradingHalted,
    isSynthMintable,
    outputAsset.L1Chain,
  ]);

  const walletConnected = useMemo(
    () => hasWalletConnected({ wallet, inputAssets: [inputAsset] }),
    [wallet, inputAsset],
  );

  const { isExchangeBNBAddress } = useCheckExchangeBNB(
    outputAsset.L1Chain === Chain.Binance ? recipient : null,
  );

  const isValidAddress = useMemo(() => {
    try {
      if (!recipient) return true;
      if (isExchangeBNBAddress) return false;

      return multichain().validateAddress({
        chain: outputAsset.L1Chain,
        address: recipient,
      });
    } catch (error) {
      console.info(error);
      return false;
    }
  }, [outputAsset, recipient, isExchangeBNBAddress]);

  const showSwapConfirmationModal = useCallback(() => {
    if (!walletConnected) {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    } else if (!hasQuote) {
      showInfoToast(t('notification.noValidQuote'));
    } else if (swapAmountTooSmall) {
      showInfoToast(t('notification.swapAmountTooSmall'), t('notification.swapAmountTooSmallDesc'));
    } else if (isExchangeBNBAddress) {
      showErrorToast(t('notification.exchangeBNBAddy'), t('notification.exchangeBNBAddyDesc'));
    } else if (!isValidAddress) {
      showErrorToast(
        t('notification.invalidRecipientAddy'),
        t('notification.invalidRecipientAddyDesc'),
      );
    } else {
      setVisibleConfirmModal(true);
    }
  }, [
    walletConnected,
    hasQuote,
    swapAmountTooSmall,
    isExchangeBNBAddress,
    isValidAddress,
    setVisibleConfirmModal,
  ]);

  const handleApprove = useCallback(() => {
    if (isInputWalletConnected) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [isInputWalletConnected, setVisibleApproveModal]);

  const isSwapValid = useMemo(
    () => !isTradingHalted && hasQuote && inputAmount.gt(0) && !swapAmountTooSmall,
    [hasQuote, inputAmount, isTradingHalted, swapAmountTooSmall],
  );

  const btnLabel = useMemo(() => {
    if (isTradingHalted) {
      return t('notification.swapNotAvailable');
    }

    if (swapAmountTooSmall) return t('notification.swapAmountTooSmall');

    if (inputAsset.isSynth && outputAsset.isSynth) return t('common.swap');
    if (inputAsset.isSynth) return t('txManager.redeem');
    if (outputAsset.isSynth) return t('txManager.mint');

    return t('common.swap');
  }, [isTradingHalted, swapAmountTooSmall, inputAsset.isSynth, outputAsset.isSynth]);

  const isApproveRequired = useMemo(
    () => isInputWalletConnected && isApproved === false,
    [isInputWalletConnected, isApproved],
  );

  const isOutputWalletConnected = useMemo(
    () => outputAsset && hasWalletConnected({ wallet, inputAssets: [outputAsset] }),
    [wallet, outputAsset],
  );

  const isWalletRequired = useMemo(
    () => !isInputWalletConnected || !(isOutputWalletConnected || recipient),
    [isInputWalletConnected, isOutputWalletConnected, recipient],
  );

  return (
    <Box className="w-full pt-5 gap-x-2">
      {isWalletRequired ? (
        <Button stretch onClick={() => setIsConnectModalOpen(true)} size="lg" variant="fancy">
          {isInputWalletConnected
            ? t('views.swap.connectOrFillRecipient')
            : t('common.connectWallet')}
        </Button>
      ) : isApproveRequired ? (
        <Button
          stretch
          disabled={!hasQuote}
          loading={!!numberOfPendingApprovals || isLoading}
          onClick={handleApprove}
          size="lg"
          variant="fancy"
        >
          {t('txManager.approve')}
        </Button>
      ) : (
        <Button
          stretch
          disabled={!isSwapValid}
          error={!isSwapValid || swapAmountTooSmall}
          loading={isLoading}
          onClick={showSwapConfirmationModal}
          size="lg"
          variant="fancy"
        >
          {btnLabel}
        </Button>
      )}
    </Box>
  );
};
