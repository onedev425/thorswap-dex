import {
  Amount,
  Asset,
  AssetAmount,
  hasConnectedWallet,
  Percent,
} from '@thorswap-lib/multichain-core';
import { AssetInput } from 'components/AssetInput';
import { Box, Button, Card, Icon, Link, Tooltip, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoTable } from 'components/InfoTable';
import { TabsSelect } from 'components/TabsSelect';
import { YIELD_BEARING_YOUTUBE } from 'config/constants';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import useWindowSize from 'hooks/useWindowSize';
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
import { EarnAssetSelectList } from 'views/Earn/EarnAssetSelectList';
import { EarnConfirmModal } from 'views/Earn/EarnConfirmModal';
import { useAssetsWithApr } from 'views/Earn/useAssetsWithApr';
import { useEarnCalculations } from 'views/Earn/useEarnCalculations';
import { WithdrawPercent } from 'views/WithdrawLiquidity/WithdrawPercent';

import { EarnButton } from './EarnButton';
import { EarnPositions } from './EarnPositions';
import { EarnTab, EarnViewTab } from './types';
import { useSaverPositions } from './useEarnPositions';

const Earn = () => {
  const appDispatch = useAppDispatch();
  const aprAssets = useAssetsWithApr(SORTED_EARN_ASSETS);
  const balanceAssets = useAssetsWithBalance(SORTED_EARN_ASSETS);

  const listAssets = useMemo(
    () => balanceAssets.map((asset, i) => ({ ...asset, ...aprAssets[i] })),
    [aprAssets, balanceAssets],
  );

  const { getMaxBalance } = useBalance();
  const { inboundHalted, pools } = useMidgard();
  const { isChainTradingHalted, maxSynthPerAssetDepth } = useMimir();
  const { positions, refreshPositions, getPosition, synthAvailability } = useSaverPositions();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const isWalletConnected = useMemo(() => hasConnectedWallet(wallet), [wallet]);
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [asset, setAsset] = useState(Asset.BTC());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(EarnTab.Deposit);
  const [viewTab, setViewTab] = useState(EarnViewTab.Earn);
  const [withdrawPercent, setWithdrawPercent] = useState(new Percent(0));
  const [availableToWithdraw, setAvailableToWithdraw] = useState(Amount.fromAssetAmount(0, 8));
  const usdPrice = usePoolAssetPriceInUsd({ asset, amount });
  const isDeposit = tab === EarnTab.Deposit;
  const { slippage, saverQuote, expectedOutputAmount, networkFee } = useEarnCalculations({
    isDeposit,
    asset,
    withdrawPercent,
    amount,
  });
  const { isLgActive } = useWindowSize();

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

  const viewTabs = useMemo(
    () => [
      { label: t('views.savings.earn'), value: EarnViewTab.Earn },
      { label: t('views.savings.myPortfolio'), value: EarnViewTab.Positions },
    ],
    [],
  );
  const depositAsset = useCallback((asset: Asset) => {
    setViewTab(EarnViewTab.Earn);
    setTab(EarnTab.Deposit);
    setAsset(asset);
  }, []);

  const withdrawAsset = useCallback((asset: Asset) => {
    setViewTab(EarnViewTab.Earn);
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

  const assetAPR = listAssets.find((assetWithApr) => assetWithApr.asset.name === asset.name);

  const summary = useMemo(
    () => [
      {
        label: t('common.slippage'),
        value: (
          <Box center>
            <Typography variant="caption">
              {`${slippage ? slippage?.toSignificant(6) : 0} ${asset.name}`}
            </Typography>
          </Box>
        ),
      },
    ],
    [slippage, asset],
  );

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <TabsSelect
        onChange={(value) => setViewTab(value as EarnViewTab)}
        tabs={viewTabs}
        value={viewTab}
      />
      {viewTab === EarnViewTab.Earn && (
        <>
          <Helmet
            content="Earn APY on native assets with THORSwap EARN"
            keywords="Earn, Savings, THORSwap, APY, Native assets"
            title={t('views.savings.earn')}
          />
          <Box className="flex w-full justify-between">
            <Box alignCenter>
              <Typography className="ml-3 mr-2" variant="h3">
                {t('views.savings.earn')} {asset.name}
              </Typography>
              <Typography color="primaryBtn" variant="h3">
                {assetAPR?.apr ? assetAPR?.apr : 'N/A'} {t('common.apr').toUpperCase()}
              </Typography>
            </Box>
          </Box>
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
          <Box row className="w-full justify-center gap-5">
            {isLgActive && (
              <Box className="w-9/12">
                <EarnAssetSelectList assets={listAssets} onSelect={setAsset} />
              </Box>
            )}
            <Box col className="flex h-full lg:w-full">
              <Card
                stretch
                className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
                size="lg"
              >
                <Box col className="self-stretch gap-2">
                  <TabsSelect
                    onChange={(value) => setTab(value as EarnTab)}
                    tabs={tabs}
                    value={tab}
                  />

                  {tab === EarnTab.Withdraw && (
                    <WithdrawPercent
                      onChange={handlePercentWithdrawChange}
                      percent={withdrawPercent}
                    />
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

                  <InfoTable horizontalInset items={summary} />

                  <EarnButton
                    address={address}
                    disabled={buttonDisabled}
                    handleSubmit={() => setIsConfirmOpen(true)}
                    label={tabLabel}
                    setIsConnectModalOpen={setIsConnectModalOpen}
                  />
                </Box>
              </Card>

              <EarnConfirmModal
                amount={amount}
                asset={asset}
                expectedOutputAmount={expectedOutputAmount}
                isOpened={isConfirmOpen}
                networkFee={networkFee}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleEarnSubmit}
                saverQuote={saverQuote}
                slippage={slippage}
                tabLabel={tabLabel}
              />
            </Box>
          </Box>
        </>
      )}
      {viewTab === EarnViewTab.Positions && (
        <Box className="w-full self-stretch">
          {isWalletConnected ? (
            <EarnPositions
              depositAsset={depositAsset}
              positions={positions}
              refresh={refreshPositions}
              withdrawAsset={withdrawAsset}
            />
          ) : (
            <Box center className="self-stretch w-full">
              <Button
                isFancy
                stretch
                className="mt-3 max-w-[460px] self-center"
                onClick={() => setIsConnectModalOpen(true)}
                size="lg"
              >
                {t('common.connectWallet')}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Earn;
