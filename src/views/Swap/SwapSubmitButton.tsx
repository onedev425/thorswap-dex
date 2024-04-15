import type { AssetValue, SwapKitNumber } from '@swapkit/core';
import { Chain } from '@swapkit/core';
import { Box, Button } from 'components/Atomic';
import { showErrorToast, showInfoToast } from 'components/Toast';
import { useConnectWallet, useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { useCallback, useMemo } from 'react';
import { t } from 'services/i18n';
import { logException } from 'services/logger';
import { IS_LEDGER_LIVE } from 'settings/config';
import { useExternalConfig } from 'store/externalConfig/hooks';
import { useTransactionsState } from 'store/transactions/hooks';

type Props = {
  hasQuote: boolean;
  invalidSwap: boolean;
  inputAmount: SwapKitNumber;
  inputAsset: AssetValue;
  isApproved: boolean | null;
  isInputWalletConnected: boolean;
  isOutputWalletConnected: boolean;
  isLoading: boolean;
  quoteError: boolean;
  outputAsset: AssetValue;
  recipient: string | null;
  setVisibleApproveModal: (visible: boolean) => void;
  setVisibleConfirmModal: (visible: boolean) => void;
};

export const SwapSubmitButton = ({
  hasQuote,
  quoteError,
  invalidSwap,
  inputAmount,
  inputAsset,
  isApproved,
  isInputWalletConnected,
  isOutputWalletConnected,
  isLoading,
  outputAsset,
  recipient,
  setVisibleApproveModal,
  setVisibleConfirmModal,
}: Props) => {
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWallet } = useWallet();
  const { connectLedgerLiveWallet } = useConnectWallet();
  const { getChainTradingPaused } = useExternalConfig();
  const { numberOfPendingApprovals } = useTransactionsState();

  const isTradingHalted: boolean = useMemo(
    () =>
      getChainTradingPaused(inputAsset.chain as Chain) ||
      getChainTradingPaused(outputAsset.chain as Chain),
    [getChainTradingPaused, inputAsset.chain, outputAsset.chain],
  );

  const walletConnected = useMemo(
    () => !!getWallet(inputAsset.chain),
    [getWallet, inputAsset.chain],
  );

  const isValidAddress = useCallback(async () => {
    try {
      if (!recipient) return true;
      const { validateAddress } = await (await import('services/swapKit')).getSwapKitClient();

      const validated = validateAddress({ chain: outputAsset.chain, address: recipient });

      return typeof validated === 'undefined' ? true : validated;
    } catch (error: NotWorth) {
      logException(error as Error);
      return false;
    }
  }, [outputAsset, recipient]);

  const showSwapConfirmationModal = useCallback(async () => {
    if (!walletConnected) {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    } else if (!hasQuote) {
      showInfoToast(t('notification.noValidQuote'));
    } else if (!(await isValidAddress())) {
      showErrorToast(
        t('notification.invalidRecipientAddy'),
        t('notification.invalidRecipientAddyDesc'),
      );
    } else {
      setVisibleConfirmModal(true);
    }
  }, [walletConnected, hasQuote, isValidAddress, setVisibleConfirmModal]);

  const handleApprove = useCallback(() => {
    if (isInputWalletConnected) {
      setVisibleApproveModal(true);
    } else {
      showInfoToast(t('notification.walletNotFound'), t('notification.connectWallet'));
    }
  }, [isInputWalletConnected, setVisibleApproveModal]);

  const isSwapValid = useMemo(
    () => !invalidSwap && !isTradingHalted && hasQuote && inputAmount.gt(0),
    [hasQuote, inputAmount, invalidSwap, isTradingHalted],
  );

  const btnLabel = useMemo(() => {
    if (isTradingHalted) return t('notification.swapNotAvailable');
    if (quoteError) return t('views.swap.noValidQuote');
    if ((inputAsset.isSynthetic && outputAsset.isSynthetic) || isSwapValid) return t('common.swap');
    if (inputAsset.isSynthetic) return t('txManager.redeem');
    if (outputAsset.isSynthetic) return t('txManager.mint');

    return t('common.swap');
  }, [isTradingHalted, quoteError, inputAsset.isSynthetic, outputAsset.isSynthetic, isSwapValid]);

  const isApproveRequired = useMemo(
    () => hasQuote && isInputWalletConnected && isApproved === false,
    [hasQuote, isInputWalletConnected, isApproved],
  );

  const isWalletRequired = useMemo(
    () => !isInputWalletConnected || !(isOutputWalletConnected || recipient),
    [isInputWalletConnected, isOutputWalletConnected, recipient],
  );

  return (
    <Box className="w-full pt-5 gap-x-2">
      {isWalletRequired ? (
        <Button
          stretch
          onClick={() =>
            !IS_LEDGER_LIVE
              ? setIsConnectModalOpen(true)
              : connectLedgerLiveWallet(isInputWalletConnected ? [outputAsset.chain] : undefined)
          }
          size="lg"
          variant="fancy"
        >
          {isInputWalletConnected && !IS_LEDGER_LIVE
            ? t('views.swap.connectOrFillRecipient')
            : t('common.connectWallet')}
        </Button>
      ) : isApproveRequired && !quoteError ? (
        <Button
          stretch
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
          error={!isSwapValid}
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
