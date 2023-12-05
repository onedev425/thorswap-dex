import { Text } from '@chakra-ui/react';
import { TransactionType } from '@swapkit/api';
import { type AssetValue, Chain, WalletOption } from '@swapkit/core';
import { Box, Button, Icon, Modal } from 'components/Atomic';
import type { InfoRowConfig } from 'components/InfoRow/types';
import { InfoTable } from 'components/InfoTable';
import { InfoTip } from 'components/InfoTip';
import { showErrorToast, showSuccessToast } from 'components/Toast';
import { useWallet, useWalletConnectModal } from 'context/wallet/hooks';
import { RUNEAsset } from 'helpers/assets';
import { chainName } from 'helpers/chainName';
import { useCallback, useMemo, useState } from 'react';
import { LoaderIcon } from 'react-hot-toast';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { v4 } from 'uuid';

type Params = {
  isOpened: boolean;
  symmetric: boolean;
  onClose: () => void;
  assetAddress?: string;
  poolAddress: string;
  poolAssetValue?: AssetValue;
  runeAddress?: string;
  runeAssetValue?: AssetValue;
};

enum Step {
  AddRune = 'addRune',
  AddAsset = 'addAsset',
  PendingAsset = 'pendingAsset',
  PendingRune = 'pendingRune',
  Completed = 'completed',
}

export const AddLPProgressModal = ({
  poolAssetValue,
  runeAssetValue,
  poolAddress,
  assetAddress,
  runeAddress,
  symmetric: isSymmetric,
  isOpened,
  onClose,
}: Params) => {
  const { isWalletLoading, getWallet } = useWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const appDispatch = useAppDispatch();
  const [step, setStep] = useState<Step>(runeAssetValue ? Step.AddRune : Step.AddAsset);

  //   const walletType = useMemo(() => ([getWallet(Chain.THORChain)?.walletType, ])}, [getWallet]);

  const handleLPAdd = useCallback(async () => {
    if (Step.Completed === step) return onClose();

    const { addLiquidityPart } = await (await import('services/swapKit')).getSwapKitClient();
    const symmetric = isSymmetric || !!(runeAssetValue && poolAssetValue);
    const runeId = v4();
    const assetId = v4();

    if (step === Step.AddRune && runeAssetValue) {
      setStep(Step.PendingRune);
      appDispatch(
        addTransaction({
          id: runeId,
          type: TransactionType.TC_LP_ADD,
          inChain: runeAssetValue.chain,
          label: t('txManager.addAmountAsset', {
            asset: runeAssetValue.ticker,
            amount: runeAssetValue.toSignificant(6),
          }),
        }),
      );

      try {
        const runeTx = await addLiquidityPart({
          address: assetAddress,
          assetValue: runeAssetValue,
          poolAddress,
          symmetric,
        });

        if (runeTx) {
          appDispatch(updateTransaction({ id: runeId, txid: runeTx, status: 'pending' }));
          setStep(symmetric ? Step.AddAsset : Step.Completed);
          showSuccessToast(
            t('txManager.addLiquidity'),
            t('txManager.addedAmountAsset', {
              asset: runeAssetValue.ticker,
              amount: runeAssetValue.toSignificant(6),
            }),
          );
        } else {
          setStep(Step.AddRune);
          showErrorToast(t('txManager.addLiquidity'), t('txManager.failed'));
          appDispatch(completeTransaction({ id: runeId, status: 'error' }));
        }
      } catch (error) {
        setStep(Step.AddRune);
        showErrorToast(t('txManager.addLiquidity'), t('txManager.failed'));
        appDispatch(completeTransaction({ id: runeId, status: 'error' }));
      }
    }

    if (step === Step.AddAsset && poolAssetValue) {
      setStep(Step.PendingAsset);
      appDispatch(
        addTransaction({
          id: assetId,
          type: TransactionType.TC_LP_ADD,
          inChain: poolAssetValue.chain,
          label: t('txManager.addAmountAsset', {
            asset: poolAssetValue.ticker,
            amount: poolAssetValue.toSignificant(6),
          }),
        }),
      );
      try {
        const assetTx = await addLiquidityPart({
          address: runeAddress,
          assetValue: poolAssetValue,
          poolAddress,
          symmetric,
        });

        if (assetTx) {
          setStep(Step.Completed);
          appDispatch(updateTransaction({ id: assetId, txid: assetTx, status: 'pending' }));
          showSuccessToast(
            t('txManager.addLiquidity'),
            t('txManager.addedAmountAsset', {
              asset: poolAssetValue.ticker,
              amount: poolAssetValue.toSignificant(6),
            }),
          );
        } else {
          setStep(Step.AddAsset);
          showErrorToast(t('txManager.addLiquidity'), t('txManager.failed'));
          appDispatch(completeTransaction({ id: assetId, status: 'error' }));
        }
      } catch (error) {
        setStep(Step.AddAsset);
        showErrorToast(t('txManager.addLiquidity'), t('txManager.failed'));
        appDispatch(completeTransaction({ id: assetId, status: 'error' }));
      }
    }
  }, [
    step,
    onClose,
    isSymmetric,
    runeAssetValue,
    poolAssetValue,
    appDispatch,
    assetAddress,
    poolAddress,
    runeAddress,
  ]);

  const items = useMemo(() => {
    const items: InfoRowConfig[] = [];

    if (runeAssetValue) {
      items.push({
        label: (
          <Box center>
            <Box className="mr-2">
              {step === Step.PendingRune ? (
                <LoaderIcon />
              ) : step === Step.AddRune ? (
                <Icon color="yellow" name="inIcon" />
              ) : (
                <Icon color="green" name="checkBoxChecked" />
              )}
            </Box>
            <Text>
              {t('views.addLiquidity.addAssetStatusLabel', { asset: runeAssetValue.ticker })}
            </Text>
          </Box>
        ),
        value: `${runeAssetValue.toSignificant(6)} ${runeAssetValue.toString(true)}`,
      });
    }

    if (poolAssetValue) {
      items.push({
        label: (
          <Box center>
            <Box className="mr-2">
              {step === Step.Completed ? (
                <Icon color="green" name="checkBoxChecked" />
              ) : step === Step.PendingAsset ? (
                <LoaderIcon />
              ) : (
                <Icon color="yellow" name="inIcon" />
              )}
            </Box>
            <Text>
              {t('views.addLiquidity.addAssetStatusLabel', { asset: poolAssetValue.ticker })}
            </Text>
          </Box>
        ),
        value: `${poolAssetValue.toSignificant(6)} ${poolAssetValue.toString(true)}`,
      });
    }

    return items;
  }, [poolAssetValue, runeAssetValue, step]);

  const actionLabel = useMemo(() => {
    switch (step) {
      case Step.AddRune:
        return t('views.addLiquidity.addAssetLabel', { asset: runeAssetValue?.ticker });
      case Step.AddAsset:
        return t('views.addLiquidity.addAssetLabel', { asset: poolAssetValue?.ticker });
      case Step.PendingAsset:
        return t('views.addLiquidity.pendingAssetLabel', { asset: poolAssetValue?.ticker });
      case Step.PendingRune:
        return t('views.addLiquidity.pendingAssetLabel', { asset: runeAssetValue?.ticker });
      case Step.Completed:
        return t('common.close');
    }
  }, [poolAssetValue, runeAssetValue, step]);

  const openWalletReminder = useMemo((): string | undefined => {
    switch (step) {
      case Step.AddRune:
      case Step.PendingRune:
        return getWallet(Chain.THORChain)?.walletType === WalletOption.LEDGER
          ? t('views.addLiquidity.openLedgerWallet', {
              chain: chainName(Chain.THORChain),
              asset: RUNEAsset.ticker,
              wallet: WalletOption.LEDGER,
            })
          : undefined;
      case Step.AddAsset:
      case Step.PendingAsset:
        return poolAssetValue && getWallet(poolAssetValue.chain)?.walletType === WalletOption.LEDGER
          ? t('views.addLiquidity.openLedgerWallet', {
              chain: chainName(poolAssetValue.chain),
              asset: poolAssetValue.ticker,
              wallet: WalletOption.LEDGER,
            })
          : undefined;
      case Step.Completed:
        return undefined;
    }
  }, [getWallet, poolAssetValue, step]);

  const completed = useMemo(() => step === Step.Completed, [step]);

  return (
    <Modal
      isOpened={isOpened}
      onClose={onClose}
      title={t('views.addLiquidity.lpProgressModalTitle')}
    >
      <Box col>
        <InfoTable items={items} />
        <Box className="py-4">
          <InfoTip content={t('views.addLiquidity.lpProgressModalDescription')} type="info" />
        </Box>
        {openWalletReminder && (
          <Box className="py-4">
            <InfoTip content={openWalletReminder} type="warn" />
          </Box>
        )}
        <Box row className="pt-4" justify={completed ? 'around' : 'between'}>
          {!completed && (
            <Button
              onClick={() => setIsConnectModalOpen(true)}
              size="md"
              variant="outlineSecondary"
            >
              {t('common.changeWallet')}
            </Button>
          )}

          <Button
            loading={isWalletLoading || [Step.PendingAsset, Step.PendingRune].includes(step)}
            onClick={handleLPAdd}
            size={completed ? 'lg' : 'md'}
            variant="fancy"
          >
            {actionLabel}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
