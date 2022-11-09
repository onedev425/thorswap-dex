import { Amount, AmountType, Asset, AssetAmount, Percent } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { AssetInput } from 'components/AssetInput';
import { Box, Card, Icon, Link, Tooltip, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoRow } from 'components/InfoRow';
import { InfoTip } from 'components/InfoTip';
import { ConfirmModal } from 'components/Modals/ConfirmModal';
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
import { SORTED_BASE_ASSETS } from 'settings/chain';
import { useMidgard } from 'store/midgard/hooks';
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
  const listAssets = useAssetsWithBalance(SORTED_BASE_ASSETS);
  const { getMaxBalance } = useBalance();
  const { inboundHalted, outboundFee, pools } = useMidgard();
  const { isChainTradingHalted, maxSynthPerAssetDepth } = useMimir();
  const { positions, refreshPositions, getPosition } = useSaverPositions();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [asset, setAsset] = useState(Asset.BTC());
  const [availableToWithdraw, setAvailableToWithdraw] = useState(Amount.fromAssetAmount(0, 8));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(SavingsTab.Deposit);
  const [withdrawPercent, setWithdrawPercent] = useState(new Percent(0));
  const [tipVisible, setTipVisible] = useState(true);
  const usdPrice = usePoolAssetPriceInUsd({ asset, amount });

  const isDeposit = tab === SavingsTab.Deposit;
  const address = useMemo(() => wallet?.[asset.L1Chain]?.address || '', [wallet, asset.L1Chain]);
  const balance = useMemo(
    () => (address ? getMaxBalance(asset) : undefined),
    [address, asset, getMaxBalance],
  );
  const tabs = useMemo(
    () => [
      { label: t('common.deposit'), value: SavingsTab.Deposit },
      { label: t('common.withdraw'), value: SavingsTab.Withdraw },
    ],
    [],
  );

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
  }, [amount, appDispatch, asset.L1Chain, asset.name, handleMultichainAction, isDeposit]);

  const { isSynthInCapacity, assetDepthAmount } = useMemo(() => {
    const defaultOptions = {
      isSynthInCapacity: true,
      assetDepthAmount: Amount.fromAssetAmount(0, 8),
    };
    if (!pools?.length) return defaultOptions;

    const { assetDepth, synthSupply } =
      pools?.find((p) => p.asset.symbol === asset.symbol)?.detail || {};

    const assetDepthAmount = Amount.fromMidgard(assetDepth);
    if (assetDepthAmount.eq(0)) return defaultOptions;

    return {
      assetDepthAmount,
      isSynthInCapacity: Amount.fromMidgard(synthSupply)
        .div(assetDepthAmount)
        .assetAmount.isLessThan(maxSynthPerAssetDepth / 10000),
    };
  }, [asset.symbol, maxSynthPerAssetDepth, pools]);

  const buttonDisabled = useMemo(
    () =>
      (balance && amount.gt(balance)) ||
      !isSynthInCapacity ||
      inboundHalted[asset.L1Chain] ||
      isChainTradingHalted[asset.L1Chain],
    [amount, asset.L1Chain, balance, inboundHalted, isChainTradingHalted, isSynthInCapacity],
  );

  const { slippage, networkFee } = useMemo(
    () => ({
      slippage: amount.div(amount.add(assetDepthAmount).mul(amount)),
      networkFee: new Amount(
        parseInt(outboundFee[asset.L1Chain] || '0') * (isDeposit ? 1 / 3 : 1),
        AmountType.BASE_AMOUNT,
        asset.decimal,
      ),
    }),
    [amount, asset.L1Chain, asset.decimal, assetDepthAmount, isDeposit, outboundFee],
  );

  const selectedAsset = useMemo(
    () => ({ asset, value: amount, balance, usdPrice }),
    [asset, amount, balance, usdPrice],
  );

  const tabLabel = tab === SavingsTab.Deposit ? t('common.deposit') : t('common.withdraw');
  const txInfos = [
    { label: t('common.action'), value: tabLabel },
    { label: t('common.asset'), value: `${asset.name}`, icon: asset },
    { label: t('common.amount'), value: `${amount.toSignificant(6)} ${asset.name}` },
    { label: t('views.wallet.networkFee'), value: `${networkFee.toSignificant(6)} ${asset.name}` },
    { label: t('common.slippage'), value: `${slippage.toSignificant(6)} ${asset.name}` },
    {
      label: tabLabel,
      value: `${amount.sub(slippage).sub(networkFee).toSignificant(6)} ${asset.name}`,
    },
  ];

  return (
    <Box col className="self-center w-full max-w-[480px] mt-2">
      <Helmet content={t('views.savings.earn')} title={t('views.savings.earn')} />
      <ViewHeader title={`${t('views.savings.earn')} ${asset.name}`} />

      <Box alignCenter className="px-3" justify="between">
        <Typography color="secondary" fontWeight="medium" variant="caption">
          {t('views.savings.description', { chain: asset.L1Chain })}
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
          <TabsSelect onChange={(value) => setTab(value as SavingsTab)} tabs={tabs} value={tab} />

          {tab === SavingsTab.Withdraw && (
            <WithdrawPercent onChange={handlePercentWithdrawChange} percent={withdrawPercent} />
          )}

          <AssetInput
            noFilters
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
              {`${t('views.savings.aprTipContent')} `}
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
        {txInfos.map((info) => (
          <InfoRow
            key={info.label}
            label={info.label}
            value={
              <Box center className="gap-1">
                <Typography variant="caption">{info.value}</Typography>
                {info.icon && <AssetIcon asset={info.icon} size={22} />}
              </Box>
            }
          />
        ))}
      </ConfirmModal>
    </Box>
  );
};

export default Savings;
