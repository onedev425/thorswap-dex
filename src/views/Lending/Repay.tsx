import { Amount, AssetAmount, AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { AssetInput } from 'components/AssetInput';
import { AssetSelectType } from 'components/AssetSelect/types';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';

import { ActionButton } from './ActionButton';
import { LendingConfirmModal } from './LendingConfirmModal';
import { RepayLoanSelectItem } from './RepayLoanSelectItem';
import { LendingTab } from './types';
import { useLoans } from './useLoans';

interface RepayLoanSelectListProps {
  assets: AssetSelectType[];
  repayAsset: AssetEntity;
  setRepayAsset: (asset: AssetEntity) => void;
}

export const Repay = ({ assets, repayAsset, setRepayAsset }: RepayLoanSelectListProps) => {
  const { refreshLoans, loans } = useLoans();
  const appDispatch = useAppDispatch();
  const { getMaxBalance } = useBalance();
  const { isChainHalted } = useMimir();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [selectedLoanAsset, setSelectedLoanAsset] = useState<AssetEntity | undefined>();

  const repayUsdPrice = usePoolAssetPriceInUsd({ asset: repayAsset, amount });

  const repayAddress = useMemo(
    () => wallet?.[repayAsset.L1Chain]?.address || '',
    [wallet, repayAsset.L1Chain],
  );

  const repayBalance = useMemo(
    () => (repayAddress ? getMaxBalance(repayAsset) : undefined),
    [repayAddress, repayAsset, getMaxBalance],
  );

  const buttonDisabled = useMemo(
    () =>
      amount.lte(Amount.fromAssetAmount(0, 8)) ||
      (repayBalance && amount.gt(repayBalance)) ||
      isChainHalted[repayAsset.L1Chain] ||
      selectedLoanAsset === undefined,
    [amount, repayAsset.L1Chain, repayBalance, isChainHalted, selectedLoanAsset],
  );

  const selectedRepayAsset = useMemo(
    () => ({
      asset: repayAsset,
      value: amount,
      balance: repayBalance,
      usdPrice: repayUsdPrice,
    }),
    [repayAsset, amount, repayBalance, repayUsdPrice],
  );

  const handleRepay = useCallback(
    async (expectedAmount: string) => {
      const { closeLoan } = await (await import('services/swapKit')).getSwapKitClient();
      setIsConfirmOpen(false);

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          label: t('txManager.closeLoan', {
            asset: repayAsset.name,
            amount: expectedAmount,
          }),
          type: TransactionType.TC_LENDING_CLOSE,
          inChain: repayAsset.L1Chain,
        }),
      );

      try {
        const txid = await closeLoan({
          assetAmount: new AssetAmount(repayAsset, amount),
          assetTicker: `${selectedLoanAsset?.chain}.${selectedLoanAsset?.ticker}`,
        });
        setAmount(Amount.fromAssetAmount(0, 8));
        if (txid) appDispatch(updateTransaction({ id, txid }));
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [
      repayAsset,
      setIsConfirmOpen,
      appDispatch,
      amount,
      selectedLoanAsset?.chain,
      selectedLoanAsset?.ticker,
    ],
  );

  useEffect(() => {
    refreshLoans();
  }, [refreshLoans, wallet, repayAsset]);

  return (
    <>
      {Object.entries(loans).map(([chain, loan]) => {
        return (
          <RepayLoanSelectItem
            asset={getSignatureAssetFor(chain as Chain)}
            balance={loan.collateralRemaining}
            isSelected={selectedLoanAsset?.chain === chain}
            key={chain}
            select={setSelectedLoanAsset}
          />
        );
      })}
      <AssetInput
        noFilters
        assets={assets}
        className="flex-1"
        onAssetChange={setRepayAsset}
        onValueChange={setAmount}
        poolAsset={selectedRepayAsset}
        selectedAsset={selectedRepayAsset}
        title={t('views.lending.collateralToDeposit')}
      />

      <ActionButton
        address={repayAddress}
        disabled={buttonDisabled}
        handleSubmit={() => setIsConfirmOpen(true)}
        label={LendingTab.Repay}
        setIsConnectModalOpen={setIsConnectModalOpen}
      />

      <LendingConfirmModal
        amount={amount}
        asset={repayAsset}
        expectedOutputAmount={amount}
        isOpened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleRepay}
        tabLabel={LendingTab.Repay}
      />
    </>
  );
};
