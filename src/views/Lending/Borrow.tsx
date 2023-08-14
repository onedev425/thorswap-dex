import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Amount, AssetAmount, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { AssetInput } from 'components/AssetInput';
import { Box, Card, Icon, Tooltip } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import dayjs from 'dayjs';
import { useFormatPrice } from 'helpers/formatPrice';
import { useAssetListSearch } from 'hooks/useAssetListSearch';
import { useAssetsWithBalance } from 'hooks/useAssetsWithBalance';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useTCBlockTimer } from 'hooks/useTCBlockTimer';
import { useCallback, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { AnnouncementType } from 'store/externalConfig/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { BorrowAssetSelectList } from 'views/Lending/BorrowAssetSelectList';
import { useLendingAssets } from 'views/Lending/useLendingAssets';
import { useLendingStatus } from 'views/Lending/useLendingStatus';
import { useLoans } from 'views/Lending/useLoans';
import { VirtualDepthInfo } from 'views/Lending/VirtualDepthInfo';
import { useAssetsWithBalanceFromTokens } from 'views/Swap/hooks/useAssetsWithBalanceFromTokens';
import { useTokenList } from 'views/Swap/hooks/useTokenList';

import { isLedgerLiveSupportedInputAsset } from '../../../ledgerLive/wallet/LedgerLive';

import { ActionButton } from './ActionButton';
import { BorrowPositionsTab } from './BorrowPositionsTab';
import { LendingConfirmModal } from './LendingConfirmModal';
import { LendingTab, LendingViewTab } from './types';
import { useBorrow } from './useBorrow';

// TODO - load from api
export const MATURITY_BLOCKS = 432000;

const Borrow = () => {
  const appDispatch = useAppDispatch();
  const { lendingAssets, getAssetCR } = useLendingAssets();
  const assetsWithBalance = useAssetsWithBalance(lendingAssets);
  const listAssets = useMemo(
    () => assetsWithBalance.map((asset) => ({ ...asset, extraInfo: getAssetCR(asset.asset) })),
    [assetsWithBalance, getAssetCR],
  );

  // output assets
  const { tokens } = useTokenList();
  const outputAssetList = useAssetsWithBalanceFromTokens(tokens);
  const { assetInputProps, assets: outputAssets } = useAssetListSearch(outputAssetList);

  const { getMaxBalance } = useBalance();
  const { isChainHalted } = useMimir();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, 8));
  const [collateralAsset, setCollateralAsset] = useState(getSignatureAssetFor(Chain.Bitcoin));
  const [borrowAsset, setBorrowAsset] = useState(getSignatureAssetFor(Chain.Bitcoin));
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(LendingTab.Borrow);
  const [viewTab, setViewTab] = useState(LendingViewTab.Borrow);
  const collateralUsdPrice = usePoolAssetPriceInUsd({ asset: collateralAsset, amount });
  const isBorrow = tab === LendingTab.Borrow;
  const formatPrice = useFormatPrice();

  const { refreshLoans, totalBorrowed, totalCollateral, loansData, isLoading } = useLoans();
  const { lendingStatus } = useLendingStatus();

  const { estimateTimeFromBlocks } = useTCBlockTimer();

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.L1Chain]?.address || '',
    [wallet, collateralAsset.L1Chain],
  );
  const borrowAddress = useMemo(
    () => wallet?.[borrowAsset.L1Chain]?.address || '',
    [wallet, borrowAsset.L1Chain],
  );

  const {
    expectedDebt,
    expectedOutput,
    expectedOutputMaxSlippage: slippage,
    memo,
    hasError,
    borrowQuote,
  } = useBorrow({
    senderAddress: collateralAddress,
    recipientAddress: borrowAddress,
    amount: amount.assetAmount.toNumber(),
    assetIn: `${collateralAsset.chain}.${collateralAsset.chain}`,
    assetOut: `${borrowAsset.chain}.${borrowAsset.chain}`,
  });
  const borrowUsdPrice = usePoolAssetPriceInUsd({
    asset: borrowAsset,
    amount: expectedOutput,
  });

  const collaterallBalance = useMemo(
    () => (collateralAddress ? getMaxBalance(collateralAsset) : undefined),
    [collateralAddress, collateralAsset, getMaxBalance],
  );
  const borrowBalance = useMemo(
    () => (borrowAddress ? getMaxBalance(borrowAsset) : undefined),
    [borrowAddress, borrowAsset, getMaxBalance],
  );

  const handleSwapkitAction = useCallback(async () => {
    const { openLoan, closeLoan } = await (await import('services/swapKit')).getSwapKitClient();

    return isBorrow
      ? openLoan({
          assetAmount: new AssetAmount(collateralAsset, amount),
          assetTicker: `${borrowAsset.getAssetObj().chain}.${borrowAsset.getAssetObj().ticker}`,
          memo,
        })
      : closeLoan({
          assetAmount: new AssetAmount(collateralAsset, amount),
          assetTicker: `${borrowAsset.getAssetObj().chain}.${borrowAsset.getAssetObj().ticker}`,
        });
  }, [amount, collateralAsset, isBorrow, borrowAsset, memo]);

  const handleBorrowSubmit = useCallback(
    async (expectedAmount: string) => {
      setIsConfirmOpen(false);

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          label: t(isBorrow ? 'txManager.openLoan' : 'txManager.closeLoan', {
            asset: collateralAsset.name,
            amount: expectedAmount,
          }),
          type: isBorrow ? TransactionType.TC_SAVINGS_ADD : TransactionType.TC_SAVINGS_WITHDRAW,
          inChain: collateralAsset.L1Chain,
        }),
      );

      try {
        const txid = await handleSwapkitAction();
        setAmount(Amount.fromAssetAmount(0, 8));
        if (txid)
          appDispatch(
            updateTransaction({
              id,
              txid,
              advancedTracker: true,
              initialPayload: borrowQuote
                ? { isLending: true, txHash: txid, ...borrowQuote }
                : undefined,
              type: TransactionType.TC_LENDING,
            }),
          );
      } catch (error) {
        console.error(error);
        appDispatch(completeTransaction({ id, status: 'error' }));
      }
    },
    [
      appDispatch,
      borrowQuote,
      collateralAsset.L1Chain,
      collateralAsset.name,
      handleSwapkitAction,
      isBorrow,
    ],
  );

  const buttonDisabled = useMemo(
    () =>
      lendingStatus?.paused ||
      amount.lte(Amount.fromAssetAmount(0, 8)) ||
      (isBorrow && collaterallBalance && amount.gt(collaterallBalance)) ||
      isChainHalted[collateralAsset.L1Chain],
    [
      lendingStatus?.paused,
      amount,
      isBorrow,
      collaterallBalance,
      isChainHalted,
      collateralAsset.L1Chain,
    ],
  );

  const tabLabel = tab === LendingTab.Borrow ? t('common.borrow') : t('common.repay');
  const selectedCollateralAsset = useMemo(
    () => ({
      asset: collateralAsset,
      value: amount,
      balance: collaterallBalance,
      usdPrice: collateralUsdPrice,
    }),
    [collateralAsset, amount, collaterallBalance, collateralUsdPrice],
  );
  const selectedBorrowAsset = useMemo(
    () => ({
      asset: borrowAsset,
      value: expectedOutput,
      balance: borrowBalance,
      usdPrice: borrowUsdPrice,
    }),
    [borrowAsset, expectedOutput, borrowBalance, borrowUsdPrice],
  );

  const summary = [
    {
      label: t('views.lending.expectedDebt'),
      value: `${formatPrice(expectedDebt.gt(0) ? expectedDebt : 0)}`,
    },
    {
      label: t('common.slippage'),
      value: `${slippage ? slippage?.toSignificant(6) : 0} ${collateralAsset.name}`,
    },
    {
      label: t('views.lending.repayMaturity'),
      value: (
        <Box center>
          <InfoWithTooltip
            tooltip={t('views.lending.maturityDescription')}
            value={
              <Text textStyle="caption">
                {dayjs.duration(estimateTimeFromBlocks(MATURITY_BLOCKS)).asDays()}{' '}
                {t('views.savings.days')}
              </Text>
            }
          />
        </Box>
      ),
    },
    {
      label: t('views.swap.exchangeFee'),
      value: (
        <Text textStyle="caption" variant="green">
          FREE
        </Text>
      ),
    },
  ];

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <Helmet
        content="Deposit and borrow native assets with THORSwap LENDING"
        keywords="Borrow, Lending, THORSwap, APY, Native assets"
        title={t('views.lending.borrow')}
      />

      {lendingStatus?.paused && (
        <Announcement
          announcement={{ type: AnnouncementType.Error, message: t('views.lending.lendingPaused') }}
          showClose={false}
        />
      )}

      <Tabs index={viewTab} onChange={setViewTab}>
        <TabList>
          <Tab>{t('views.lending.borrow')}</Tab>
          <Tab>{t('views.lending.myLoans')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box col className="gap-3">
              <Box className="flex w-full justify-between">
                <Box alignCenter>
                  <Text className="ml-3 mr-2" textStyle="h3">
                    {t('views.lending.header', { asset: borrowAsset.name })}
                  </Text>

                  <Tooltip
                    content={t('views.lending.tooltipDescription', { asset: collateralAsset.name })}
                    place="bottom"
                  >
                    <Icon color="primaryBtn" name="infoCircle" size={24} />
                  </Tooltip>
                </Box>
              </Box>

              <Box alignCenter className="px-3 gap-3">
                <Text fontWeight="medium" textStyle="caption" variant="secondary">
                  {t('views.lending.description', {
                    asset: collateralAsset.name,
                    borrowAsset: borrowAsset.name,
                  })}
                  {/* <Link className="text-twitter-blue cursor-pointer" to={SAVERS_MEDIUM}>
                    <Text fontWeight="medium" textStyle="caption" variant="blue">
                      {`${t('common.learnMore')} →`}
                    </Text>
                  </Link> */}
                </Text>
              </Box>

              <Box row className="justify-center gap-5">
                <Box col className={classNames('flex h-full')}>
                  <Card
                    className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto"
                    size="lg"
                  >
                    <Flex direction="column" gap={2}>
                      <Flex direction="column">
                        <Flex
                          alignItems="center"
                          direction="row"
                          justifyContent="space-between"
                          mr={2}
                        >
                          <Text mb={1} ml={5} textStyle="caption">
                            {t('views.lending.collateralToDeposit')}
                          </Text>
                          <Flex mb={1}>
                            <VirtualDepthInfo depth={80} />
                          </Flex>
                        </Flex>
                        <AssetInput
                          noFilters
                          AssetListComponent={BorrowAssetSelectList}
                          assets={listAssets}
                          className="flex-1 !py-1"
                          onAssetChange={setCollateralAsset}
                          onValueChange={setAmount}
                          poolAsset={selectedCollateralAsset}
                          selectedAsset={selectedCollateralAsset}
                        />
                      </Flex>

                      <Flex direction="column">
                        <Text mb={1} ml={5} textStyle="caption">
                          {t('views.lending.borrowAmount')}
                        </Text>
                        <AssetInput
                          {...assetInputProps}
                          disabled
                          assets={outputAssets.filter(isLedgerLiveSupportedInputAsset)}
                          className="flex-1 !py-1"
                          onAssetChange={setBorrowAsset}
                          poolAsset={selectedBorrowAsset}
                          selectedAsset={selectedBorrowAsset}
                        />
                      </Flex>

                      <Flex mt={2}>
                        <InfoTable horizontalInset items={summary} size="sm" />
                      </Flex>

                      <ActionButton
                        address={collateralAddress}
                        disabled={buttonDisabled}
                        handleSubmit={() => setIsConfirmOpen(true)}
                        hasError={!amount || hasError || lendingStatus?.paused}
                        label={tabLabel}
                        setIsConnectModalOpen={setIsConnectModalOpen}
                      />
                    </Flex>
                  </Card>

                  <LendingConfirmModal
                    amount={amount}
                    asset={collateralAsset}
                    expectedOutputAmount={expectedOutput}
                    isOpened={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleBorrowSubmit}
                    tabLabel={tabLabel}
                  />
                </Box>
              </Box>
            </Box>
          </TabPanel>
          <TabPanel>
            <BorrowPositionsTab
              isLoading={isLoading}
              loans={loansData}
              refreshLoans={refreshLoans}
              setCollateralAsset={setCollateralAsset}
              setTab={setTab}
              setViewTab={setViewTab}
              totalBorrowed={totalBorrowed}
              totalCollateral={totalCollateral}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Borrow;
