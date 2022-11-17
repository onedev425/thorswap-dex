import { Amount, Asset, AssetAmount, Percent } from '@thorswap-lib/multichain-core';
import { AssetInput } from 'components/AssetInput';
import { Box, Card, Icon, Link, Tooltip, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoTip } from 'components/InfoTip';
import { TabsSelect } from 'components/TabsSelect';
import { ViewHeader } from 'components/ViewHeader';
import { YIELD_BEARING_YOUTUBE } from 'config/constants';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { SORTED_EARN_ASSETS } from 'settings/chain';
import { useMidgard } from 'store/midgard/hooks';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { EarnConfirmModal } from 'views/Earn/EarnConfirmModal';
import { WithdrawPercent } from 'views/WithdrawLiquidity/WithdrawPercent';

import { EarnButton } from './EarnButton';
import { EarnPositions } from './EarnPositions';
import { EarnTab } from './types';
import { useSaverPositions } from './useEarnPositions';

const Earn = () => {
  const appDispatch = useAppDispatch();
  const listAssets = useAssetsWithBalance(SORTED_EARN_ASSETS);
  const { getMaxBalance } = useBalance();
  const { inboundHalted, pools } = useMidgard();
  const { isChainTradingHalted, maxSynthPerAssetDepth } = useMimir();
  const { positions, refreshPositions, getPosition, synthAvailability } = useSaverPositions();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [asset, setAsset] = useState(Asset.BTC());
  const [availableToWithdraw, setAvailableToWithdraw] = useState(Amount.fromAssetAmount(0, 8));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(EarnTab.Deposit);
  const [withdrawPercent, setWithdrawPercent] = useState(new Percent(0));
  const [tipVisible, setTipVisible] = useState(true);
  const usdPrice = usePoolAssetPriceInUsd({ asset, amount });

  const isDeposit = tab === EarnTab.Deposit;
  const address = useMemo(() => wallet?.[asset.L1Chain]?.address || '', [wallet, asset.L1Chain]);
  const balance = useMemo(
    () => (address ? getMaxBalance(asset) : undefined),
    [address, asset, getMaxBalance],
  );
  const tabs = useMemo(
    () => [
      { label: t('common.deposit'), value: EarnTab.Deposit },
      { label: t('common.withdraw'), value: EarnTab.Withdraw },
    ],
    [],
  );

  const depositAsset = useCallback((asset: Asset) => {
    setTab(EarnTab.Deposit);
    setAsset(asset);
  }, []);

  const withdrawAsset = useCallback((asset: Asset) => {
    setTab(EarnTab.Withdraw);
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

  const handleMultichainAction = useCallback(
    () =>
      isDeposit
        ? multichain().addSavings(new AssetAmount(asset, amount))
        : multichain().withdrawSavings({ asset, percent: withdrawPercent }),
    [amount, asset, isDeposit, withdrawPercent],
  );

  const handleEarnSubmit = useCallback(
    async (expectedAmount: string) => {
      setIsConfirmOpen(false);

      const id = v4();

      appDispatch(
        addTransaction({
          id,
          label: t(isDeposit ? 'txManager.addAmountAsset' : 'txManager.withdrawAmountAsset', {
            asset: asset.name,
            amount: expectedAmount,
          }),
          type: isDeposit ? TransactionType.TC_SAVINGS_ADD : TransactionType.TC_SAVINGS_WITHDRAW,
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
    },
    [appDispatch, asset.L1Chain, asset.name, handleMultichainAction, isDeposit],
  );

  const isSynthInCapacity = useMemo(() => {
    const defaultOptions = {
      isSynthInCapacity: !synthAvailability?.[asset.L1Chain],
      assetDepthAmount: Amount.fromAssetAmount(0, 8),
    };
    if (!pools?.length) return defaultOptions;

    const { assetDepth, synthSupply } =
      pools?.find((p) => p.asset.symbol === asset.symbol)?.detail || {};

    const assetDepthAmount = Amount.fromMidgard(assetDepth);
    if (assetDepthAmount.eq(0)) return defaultOptions;

    return (
      !synthAvailability?.[asset.L1Chain] &&
      Amount.fromMidgard(synthSupply)
        .div(assetDepthAmount)
        .assetAmount.isLessThan(maxSynthPerAssetDepth / 10000)
    );
  }, [asset.L1Chain, asset.symbol, maxSynthPerAssetDepth, pools, synthAvailability]);

  const buttonDisabled = useMemo(
    () =>
      amount.lte(Amount.fromAssetAmount(0, 8)) ||
      (isDeposit && balance && amount.gt(balance)) ||
      !isSynthInCapacity ||
      inboundHalted[asset.L1Chain] ||
      isChainTradingHalted[asset.L1Chain],
    [
      amount,
      asset.L1Chain,
      balance,
      inboundHalted,
      isChainTradingHalted,
      isDeposit,
      isSynthInCapacity,
    ],
  );

  const tabLabel = tab === EarnTab.Deposit ? t('common.deposit') : t('common.withdraw');
  const selectedAsset = useMemo(
    () => ({ asset, value: amount, balance, usdPrice }),
    [asset, amount, balance, usdPrice],
  );

  return (
    <Box col className="self-center w-full max-w-[480px] mt-2">
      <Helmet
        content="Earn APY on native assets with THORSwap EARN"
        keywords="Earn, Savings, THORSwap, APY, Native assets"
        title={t('views.savings.earn')}
      />
      <ViewHeader title={`${t('views.savings.earn')} ${asset.name}`} />

      <Box alignCenter className="px-3" justify="between">
        <Typography color="secondary" fontWeight="medium" variant="caption">
          {t('views.savings.description', { asset: asset.name })}
          <Link className="text-twitter-blue cursor-pointer" to={YIELD_BEARING_YOUTUBE}>
            <Typography color="blue" fontWeight="medium" variant="caption">
              {`${t('common.learnMore')} →`}
            </Typography>
          </Link>
        </Typography>
        <Tooltip
          content={t('views.savings.tooltipDescription', { asset: asset.name })}
          place="bottom"
        >
          <Icon color="primaryBtn" name="infoCircle" size={24} />
        </Tooltip>
      </Box>

      <Card
        stretch
        className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
        size="lg"
      >
        <Box col className="self-stretch gap-2">
          <TabsSelect onChange={(value) => setTab(value as EarnTab)} tabs={tabs} value={tab} />

          {tab === EarnTab.Withdraw && (
            <WithdrawPercent onChange={handlePercentWithdrawChange} percent={withdrawPercent} />
          )}

          <AssetInput
            noFilters
            assets={listAssets}
            className="flex-1"
            disabled={tab === EarnTab.Withdraw}
            onAssetChange={setAsset}
            onValueChange={setAmount}
            poolAsset={selectedAsset}
            selectedAsset={selectedAsset}
          />

          <EarnButton
            address={address}
            disabled={buttonDisabled}
            handleSubmit={() => setIsConfirmOpen(true)}
            label={tabLabel}
            setIsConnectModalOpen={setIsConnectModalOpen}
          />
        </Box>
      </Card>

      {tipVisible && (
        <InfoTip
          className="mt-3"
          content={
            <>
              {t('views.savings.aprTipContent')}

              <Link className="text-twitter-blue" to={YIELD_BEARING_YOUTUBE}>
                {t('common.learnMore')}
              </Link>
            </>
          }
          onClose={() => setTipVisible(false)}
          title={t('views.savings.aprTipTitle')}
          type="info"
        />
      )}

      <EarnPositions
        depositAsset={depositAsset}
        positions={positions}
        refresh={refreshPositions}
        withdrawAsset={withdrawAsset}
      />

      <EarnConfirmModal
        amount={amount}
        asset={asset}
        isDeposit={isDeposit}
        isOpened={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleEarnSubmit}
        tabLabel={tabLabel}
        withdrawPercent={withdrawPercent}
      />
    </Box>
  );
};

export default Earn;
