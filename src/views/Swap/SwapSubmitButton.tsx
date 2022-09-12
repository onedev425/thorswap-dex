import { Amount, Asset, hasWalletConnected } from '@thorswap-lib/multichain-sdk';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { useCheckExchangeBNB } from 'hooks/useCheckExchangeBNB';
import { useMimir } from 'hooks/useMimir';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { useMidgard } from 'store/midgard/hooks';
import { useAppSelector } from 'store/store';
import { TransactionType } from 'store/transactions/types';
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
  const { maxSynthPerAssetDepth } = useMimir();
  const { getChainTradingPaused } = useExternalConfig();
  const numberOfPendingApprovals = useAppSelector(
    ({ transactions }) =>
      transactions.pending.filter(({ type }) => type === TransactionType.ETH_APPROVAL).length,
  );

  const isTradingHalted: boolean = useMemo(() => {
    const inTradeHalted = inboundHalted[inputAsset.L1Chain as SupportedChain];
    const outTradeHated = inboundHalted[outputAsset.L1Chain as SupportedChain];

    return (
      inTradeHalted ||
      outTradeHated ||
      getChainTradingPaused(inputAsset.L1Chain as SupportedChain) ||
      getChainTradingPaused(outputAsset.L1Chain as SupportedChain)
    );
  }, [getChainTradingPaused, inboundHalted, inputAsset.L1Chain, outputAsset.L1Chain]);

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

  const isSwapValid = useMemo(
    () =>
      hasQuote && inputAmount.gt(0) && (isSynthMintable || !isTradingHalted) && !swapAmountTooSmall,
    [hasQuote, inputAmount, isSynthMintable, isTradingHalted, swapAmountTooSmall],
  );

  const btnLabel = useMemo(() => {
    if (!isSwapValid) {
      if (isTradingHalted || !isSynthMintable) {
        return isSynthMintable ? t('notification.swapNotAvailable') : t('txManager.mint');
      }
    }

    if (swapAmountTooSmall) return t('notification.swapAmountTooSmall');

    if (inputAsset.isSynth && outputAsset.isSynth) return t('common.swap');
    if (inputAsset.isSynth) return t('txManager.redeem');
    if (outputAsset.isSynth) return t('txManager.mint');

    return t('common.swap');
  }, [
    isSwapValid,
    swapAmountTooSmall,
    inputAsset.isSynth,
    outputAsset.isSynth,
    isTradingHalted,
    isSynthMintable,
  ]);

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
        <Button isFancy stretch onClick={() => setIsConnectModalOpen(true)} size="lg">
          {t('common.connectWallet')}
        </Button>
      ) : isApproveRequired ? (
        <Button
          isFancy
          stretch
          disabled={!hasQuote}
          loading={!!numberOfPendingApprovals || isLoading}
          onClick={handleApprove}
          size="lg"
        >
          {t('txManager.approve')}
        </Button>
      ) : (
        <Button
          isFancy
          stretch
          disabled={!isSwapValid}
          error={!isSwapValid || swapAmountTooSmall}
          loading={isLoading}
          onClick={showSwapConfirmationModal}
          size="lg"
        >
          {btnLabel}
        </Button>
      )}
    </Box>
  );
};
