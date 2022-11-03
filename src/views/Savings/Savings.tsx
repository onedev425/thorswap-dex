import { Amount, Asset, AssetAmount, Percent } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { AssetInput } from 'components/AssetInput';
import { Box, Card, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoRow } from 'components/InfoRow';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { SORTED_BASE_ASSETS } from 'settings/chain';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { WithdrawPercent } from 'views/WithdrawLiquidity/WithdrawPercent';

import { SavingsButton } from './SavingsButton';
import { SavingsPositions } from './SavingsPositions';
import { SavingsTab } from './types';
import { useSaverPositions } from './useSaverPositions';

const Savings = () => {
  const appDispatch = useAppDispatch();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { wallet, setIsConnectModalOpen } = useWallet();
  const { getMaxBalance } = useBalance();

  const listAssets = useAssetsWithBalance(SORTED_BASE_ASSETS);

  const [availableToWithdraw, setAvailableToWithdraw] = useState(Amount.fromAssetAmount(0, 8));
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [asset, setAsset] = useState(Asset.BTC());
  const [withdrawPercent, setWithdrawPercent] = useState(new Percent(0));
  const [tab, setTab] = useState(SavingsTab.Deposit);
  const { positions, refreshPositions, getPosition } = useSaverPositions();
  const isDeposit = tab === SavingsTab.Deposit;

  const address = useMemo(() => wallet?.[asset.L1Chain]?.address || '', [wallet, asset.L1Chain]);

  const depositAsset = useCallback((asset: Asset) => {
    setTab(SavingsTab.Deposit);
    setAsset(asset);
  }, []);

  const withdrawAsset = useCallback((asset: Asset) => {
    setTab(SavingsTab.Withdraw);
    setAsset(asset);
  }, []);

  const handlePercentWithdrawChange = useCallback(
    (percent: Percent) => {
      setWithdrawPercent(percent);

      if (address) {
        setAmount(availableToWithdraw.mul(percent.div(100)));
      }
    },
    [address, availableToWithdraw],
  );

  useEffect(() => {
    const pos = getPosition(asset);
    setAvailableToWithdraw(pos?.amount || Amount.fromAssetAmount(0, 8));
  }, [asset, getPosition, positions]);

  useEffect(() => {
    refreshPositions();
  }, [asset, refreshPositions]);

  const selectedAsset = useMemo(
    () => ({ asset, value: amount, balance: address ? getMaxBalance(asset) : undefined }),
    [address, asset, amount, getMaxBalance],
  );

  const handleMultichainAction = useCallback(
    () =>
      isDeposit
        ? multichain().addSavings(new AssetAmount(asset, amount))
        : multichain().withdrawSavings({ asset, percent: withdrawPercent }),
    [amount, asset, isDeposit, withdrawPercent],
  );

  const handleSavingsSubmit = useCallback(async () => {
    setIsConfirmOpen(false);

    const id = v4();

    appDispatch(
      addTransaction({
        id,
        label: t(isDeposit ? 'txManager.addAmountAsset' : 'txManager.withdrawAmountAsset', {
          asset: asset.name,
          amount: amount.toSignificant(6),
        }),
        type: isDeposit ? TransactionType.TC_LP_ADD : TransactionType.TC_SAVINGS_WITHDRAW,
        inChain: asset.L1Chain,
      }),
    );

    try {
      const txid = await handleMultichainAction();
      setAmount(Amount.fromAssetAmount(0, 8));
      if (txid) appDispatch(updateTransaction({ id, txid }));
    } catch (error) {
      console.error(error);
      appDispatch(completeTransaction({ id, status: 'error' }));
    }
  }, [amount, appDispatch, asset.L1Chain, asset.name, handleMultichainAction, isDeposit]);

  const tabs = useMemo(
    () => [
      { label: t('common.deposit'), value: SavingsTab.Deposit },
      { label: t('common.withdraw'), value: SavingsTab.Withdraw },
    ],
    [],
  );

  return (
    <Box col className="self-center w-full max-w-[480px] mt-2">
      <Helmet content={t('views.savings.earn')} title={t('views.savings.earn')} />
      <ViewHeader title={t('views.savings.earn')} />

      <Box alignCenter className="px-3" justify="between">
        <Typography color="secondary" fontWeight="medium" variant="caption">
          {t('views.savings.description', { chain: asset.L1Chain })}
        </Typography>

        {/* <Tooltip content={t('views.savings.stakeInfo')} place="bottom">
          <Icon color="secondary" name="chart" size={24} />
        </Tooltip> */}
      </Box>

      <Card
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
        size="lg"
      >
        <Box col className="self-stretch gap-2">
          <TabsSelect onChange={(value) => setTab(value as SavingsTab)} tabs={tabs} value={tab} />

          {tab === SavingsTab.Withdraw && (
            <WithdrawPercent onChange={handlePercentWithdrawChange} percent={withdrawPercent} />
          )}

          <AssetInput
            assets={listAssets}
            className="flex-1"
            disabled={tab === SavingsTab.Withdraw}
            onAssetChange={setAsset}
            onValueChange={setAmount}
            poolAsset={selectedAsset}
            selectedAsset={selectedAsset}
          />

          <SavingsButton
            address={address}
            handleSubmit={() => setIsConfirmOpen(true)}
            label={tab === SavingsTab.Deposit ? t('common.deposit') : t('common.withdraw')}
            setIsConnectModalOpen={setIsConnectModalOpen}
          />
        </Box>
      </Card>

      <SavingsPositions
        depositAsset={depositAsset}
        positions={positions}
        refresh={refreshPositions}
        withdrawAsset={withdrawAsset}
      />

      <ConfirmModal
        inputAssets={[asset]}
        isOpened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleSavingsSubmit}
      >
        <InfoRow
          label={tab === SavingsTab.Deposit ? t('common.deposit') : t('common.withdraw')}
          value={
            <Box center className="gap-1">
              <Typography variant="caption">
                {amount.toSignificant(6)} {asset.name}
              </Typography>
              <AssetIcon asset={asset} size={22} />
            </Box>
          }
        />
      </ConfirmModal>
    </Box>
  );
};

export default Savings;
