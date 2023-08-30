import { Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import {
  Amount,
  AmountType,
  AssetAmount,
  AssetEntity,
  getSignatureAssetFor,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetInput } from 'components/AssetInput';
import { Box, Button, Card, Icon, Link, Tooltip } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { PercentageSlider } from 'components/PercentageSlider';
import { TabsSelect } from 'components/TabsSelect';
import { SAVERS_MEDIUM } from 'config/constants';
import { getEVMDecimal } from 'helpers/getEVMDecimal';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useCheckHardCap } from 'hooks/useCheckHardCap';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useTCApprove } from 'hooks/useTCApprove';
import useWindowSize from 'hooks/useWindowSize';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { EarnAssetSelectList } from 'views/Earn/EarnAssetSelectList';
import { EarnConfirmModal } from 'views/Earn/EarnConfirmModal';
import { EarnPositionsTab } from 'views/Earn/EarnPositionsTab';
import { useAssetsWithApr } from 'views/Earn/useAssetsWithApr';
import { useEarnCalculations } from 'views/Earn/useEarnCalculations';
import { ApproveModal } from 'views/Swap/ApproveModal';
import { useIsAssetApproved } from 'views/Swap/hooks/useIsAssetApproved';

import { EarnButton } from './EarnButton';
import { EarnTab, EarnViewTab } from './types';
import { useSaverPositions } from './useEarnPositions';

const Earn = () => {
  const appDispatch = useAppDispatch();
  const aprAssets = useAssetsWithApr();
  const balanceAssets = useAssetsWithBalance();
  const hardCapReached = useCheckHardCap();

  const listAssets = useMemo(
    () =>
      balanceAssets.map((ba) => {
        const aprAsset = aprAssets.find(
          ({ asset: { name, chain } }) => name === ba?.asset.name && chain === ba?.asset.chain,
        );

        return {
          ...aprAsset,
          ...ba,
        };
      }),
    [aprAssets, balanceAssets],
  );

  const { getMaxBalance } = useBalance();
  const { isChainHalted } = useMimir();
  const { positions, refreshPositions, getPosition, synthAvailability } = useSaverPositions();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [asset, setAsset] = useState(getSignatureAssetFor(Chain.Bitcoin));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [tab, setTab] = useState(EarnTab.Deposit);
  const [viewTab, setViewTab] = useState(EarnViewTab.Earn);
  const [withdrawPercent, setWithdrawPercent] = useState(new Amount(0, AmountType.ASSET_AMOUNT, 2));
  const [availableToWithdraw, setAvailableToWithdraw] = useState(Amount.fromAssetAmount(0, 8));
  const usdPrice = usePoolAssetPriceInUsd({ asset, amount });
  const isDeposit = tab === EarnTab.Deposit;

  const { isApproved, isLoading } = useIsAssetApproved({
    asset,
    force: true,
    amount: amount.gt(0) ? amount : undefined,
  });

  const handleApprove = useTCApprove({ asset });

  const currentAsset = useMemo(
    () => listAssets.find(({ asset: { name } }) => name === asset.name),
    [asset.name, listAssets],
  );

  const { slippage, saverQuote, expectedOutputAmount, networkFee, daysToBreakEven } =
    useEarnCalculations({
      isDeposit,
      asset,
      withdrawPercent,
      amount,
      apr: currentAsset?.aprRaw,
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

  const depositAsset = useCallback((asset: AssetEntity) => {
    setViewTab(EarnViewTab.Earn);
    setTab(EarnTab.Deposit);
    setAsset(asset);
  }, []);

  const withdrawAsset = useCallback((asset: AssetEntity) => {
    setViewTab(EarnViewTab.Earn);
    setTab(EarnTab.Withdraw);
    setAsset(asset);
  }, []);

  const handlePercentWithdrawChange = useCallback(
    (amount: Amount) => {
      setWithdrawPercent(amount);

      if (address) {
        setAmount(availableToWithdraw.mul(amount.div(100)));
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

  useEffect(() => {
    const setAssetDecimals = async () => {
      if (asset) {
        const assetDecimal = await getEVMDecimal(asset);
        if (!assetDecimal || asset.decimal === assetDecimal) return;

        asset.setDecimal(assetDecimal);
        setAsset(asset);
      }
    };

    setAssetDecimals();
  }, [asset]);

  const handleAssetChange = useCallback((asset: AssetEntity) => {
    setAsset(asset);
    setAmount(Amount.fromAssetAmount(0, asset.decimal));
  }, []);

  const handleSwapkitAction = useCallback(async () => {
    const { addSavings, withdrawSavings } = await (
      await import('services/swapKit')
    ).getSwapKitClient();

    return isDeposit
      ? addSavings({
          assetAmount: new AssetAmount(
            asset,
            Amount.fromAssetAmount(amount.assetAmount.toString(), asset.decimal),
          ),
        })
      : withdrawSavings({ asset, percent: withdrawPercent });
  }, [amount, asset, isDeposit, withdrawPercent]);

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
        const txid = await handleSwapkitAction();
        setAmount(Amount.fromAssetAmount(0, 8));
        if (txid) appDispatch(updateTransaction({ id, txid }));
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [appDispatch, asset.L1Chain, asset.name, handleSwapkitAction, isDeposit],
  );

  const isSynthInCapacity = useMemo(
    () => !synthAvailability?.[asset.L1Chain] && (currentAsset?.filled || 0) < 99.5,
    [asset.L1Chain, currentAsset?.filled, synthAvailability],
  );

  const buttonDisabled = useMemo(
    () =>
      amount.lte(Amount.fromAssetAmount(0, 8)) ||
      (isDeposit && ((balance && amount.gt(balance)) || !isSynthInCapacity)) ||
      isChainHalted[asset.L1Chain],
    [amount, asset.L1Chain, balance, isChainHalted, isDeposit, isSynthInCapacity],
  );

  const tabLabel = tab === EarnTab.Deposit ? t('common.deposit') : t('common.withdraw');
  const selectedAsset = useMemo(
    () => ({ asset, value: amount, balance, usdPrice }),
    [asset, amount, balance, usdPrice],
  );

  const timeToBreakEvenInfo = useMemo(
    () => (
      <Box center>
        <Text textStyle="caption" textTransform="uppercase">
          <InfoWithTooltip
            tooltip={t('views.savings.timeToBrakeEvenTip')}
            value={`${isFinite(daysToBreakEven) ? daysToBreakEven : 0} ${
              daysToBreakEven === 1 ? t('views.savings.day') : t('views.savings.days')
            }`}
          />
        </Text>
      </Box>
    ),
    [daysToBreakEven],
  );

  const summary = useMemo(
    () => [
      {
        label: t('common.slippage'),
        value: (
          <Box center>
            <Text textStyle="caption">
              {`${slippage ? slippage?.toSignificant(6) : 0} ${asset.name}`}
            </Text>
          </Box>
        ),
      },
      {
        label: t('views.savings.timeToBrakeEven'),
        value: timeToBreakEvenInfo,
      },
    ],
    [slippage, asset.name, timeToBreakEvenInfo],
  );

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <Helmet
        content="Earn APY on native assets with THORSwap EARN"
        keywords="Earn, Savings, THORSwap, APY, Native assets"
        title={t('views.savings.earn')}
      />

      <Tabs index={viewTab} onChange={setViewTab}>
        <TabList>
          <Tab>{t('views.savings.earn')}</Tab>
          <Tab>{t('views.savings.myPositions')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box col className="gap-3">
              <Box className="flex w-full justify-between">
                <Box alignCenter>
                  <Text className="ml-3 mr-2" textStyle="h3">
                    {t('views.savings.earn')} {asset.name}
                  </Text>
                  <Text textStyle="h3" variant="primaryBtn">
                    {currentAsset?.apr
                      ? `${currentAsset?.apr} ${t('common.apr').toUpperCase()}`
                      : ''}
                  </Text>

                  <Tooltip
                    content={t('views.savings.aprTooltip', { asset: asset.name })}
                    place="bottom"
                  >
                    <Icon className="ml-1" color="primaryBtn" name="infoCircle" size={24} />
                  </Tooltip>
                </Box>
              </Box>

              <Box alignCenter className="px-3" justify="between">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('views.savings.description', { asset: asset.name })}
                  <Link className="text-twitter-blue cursor-pointer" to={SAVERS_MEDIUM}>
                    <Text fontWeight="medium" textStyle="caption" variant="blue">
                      {`${t('common.learnMore')} →`}
                    </Text>
                  </Link>
                </Text>

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
                    <EarnAssetSelectList
                      assets={listAssets}
                      onSelect={handleAssetChange}
                      selectedAsset={asset}
                    />
                  </Box>
                )}

                <Box col className={classNames('flex h-full', isLgActive && 'w-full')}>
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
                        <PercentageSlider
                          onChange={handlePercentWithdrawChange}
                          percent={withdrawPercent}
                          title={t('common.withdrawPercent')}
                        />
                      )}

                      <AssetInput
                        noFilters
                        AssetListComponent={EarnAssetSelectList}
                        assets={listAssets}
                        className="flex-1"
                        disabled={tab === EarnTab.Withdraw}
                        onAssetChange={handleAssetChange}
                        onValueChange={setAmount}
                        poolAsset={selectedAsset}
                        selectedAsset={selectedAsset}
                      />

                      <InfoTable horizontalInset items={summary} />

                      {!buttonDisabled && !isApproved ? (
                        <Box className="w-full pt-5">
                          <Button
                            stretch
                            error={hardCapReached}
                            loading={isLoading}
                            onClick={() => setVisibleApproveModal(true)}
                            size="lg"
                            tooltip={
                              hardCapReached
                                ? t('views.liquidity.hardCapReachedTooltip')
                                : undefined
                            }
                            variant="fancy"
                          >
                            {t('common.approve')}
                          </Button>
                        </Box>
                      ) : (
                        <EarnButton
                          address={address}
                          disabled={buttonDisabled}
                          handleSubmit={() => setIsConfirmOpen(true)}
                          hardCapReached={tab === EarnTab.Deposit && hardCapReached}
                          label={tabLabel}
                          setIsConnectModalOpen={setIsConnectModalOpen}
                        />
                      )}
                    </Box>
                  </Card>

                  <ApproveModal
                    handleApprove={handleApprove}
                    inputAmount={amount}
                    inputAsset={asset}
                    setVisible={setVisibleApproveModal}
                    visible={visibleApproveModal}
                  />

                  <EarnConfirmModal
                    amount={amount}
                    asset={asset}
                    expectedAmountOut={saverQuote?.expected_amount_out}
                    expectedOutputAmount={expectedOutputAmount}
                    isOpened={isConfirmOpen}
                    networkFee={networkFee}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleEarnSubmit}
                    outboundDelay={saverQuote?.outbound_delay_seconds || 0}
                    slippage={slippage}
                    tabLabel={tabLabel}
                    timeToBreakEvenInfo={timeToBreakEvenInfo}
                  />
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <EarnPositionsTab
              onDeposit={depositAsset}
              onWithdraw={withdrawAsset}
              positions={positions}
              refreshPositions={refreshPositions}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Earn;
