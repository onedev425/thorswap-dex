import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { Amount, AssetAmount, AssetEntity, getSignatureAssetFor } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { AssetInput } from 'components/AssetInput';
import { Box, Button, Card, Link } from 'components/Atomic';
import { GlobalSettingsPopover } from 'components/GlobalSettings';
import { Helmet } from 'components/Helmet';
import { InfoTable } from 'components/InfoTable';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { Input } from 'components/Input';
import { TxOptimizeSection } from 'components/TxOptimize/TxOptimizeSection';
import dayjs from 'dayjs';
import { useFormatPrice } from 'helpers/formatPrice';
import { useAssetListSearch } from 'hooks/useAssetListSearch';
import { useBalance } from 'hooks/useBalance';
import { useMimir } from 'hooks/useMimir';
import { usePoolAssetPriceInUsd } from 'hooks/usePoolAssetPriceInUsd';
import { useTCBlockTimer } from 'hooks/useTCBlockTimer';
import { useTokenPrices } from 'hooks/useTokenPrices';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { AnnouncementType } from 'store/externalConfig/types';
import { useAppDispatch } from 'store/store';
import { addTransaction, completeTransaction, updateTransaction } from 'store/transactions/slice';
import { TransactionType } from 'store/transactions/types';
import { useWallet } from 'store/wallet/hooks';
import { v4 } from 'uuid';
import { BorrowAssetSelectList } from 'views/Lending/BorrowAssetSelectList';
import { BorrowConfirmModal } from 'views/Lending/BorrowConfirmModal';
import { useLendingAssets } from 'views/Lending/useLendingAssets';
import { useLoans } from 'views/Lending/useLoans';
import { VirtualDepthSlippageInfo } from 'views/Lending/VirtualDepthSippageInfo';
import { CustomRecipientInput } from 'views/Swap/CustomRecipientInput';
import { useAssetsWithBalanceFromTokens } from 'views/Swap/hooks/useAssetsWithBalanceFromTokens';
import { useTokenList } from 'views/Swap/hooks/useTokenList';

import { isLedgerLiveSupportedInputAsset } from '../../../ledgerLive/wallet/LedgerLive';

import { ActionButton } from './ActionButton';
import { BorrowPositionsTab } from './BorrowPositionsTab';
import { LendingTab, LendingViewTab } from './types';
import { useBorrow } from './useBorrow';

export const LENDING_DOCS = 'https://docs.thorchain.org/thorchain-finance/lending';
export const ETH_USDC_IDENTIFIER = 'ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48';
export const MATURITY_BLOCKS = 432000;

export const slippageOptions = [
  { value: 1, text: '1%' },
  { value: 3, text: '3%' },
  { value: 5, text: '5%' },
  { value: 10, text: '10%' },
];

const Borrow = () => {
  const appDispatch = useAppDispatch();
  const lendingAssets = useLendingAssets();
  const { getMaxBalance } = useBalance();
  const { isChainHalted } = useMimir();
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { isLendingPaused } = useMimir();

  // output assets
  const { tokens } = useTokenList();
  const outputAssetList = useAssetsWithBalanceFromTokens(tokens, true);
  const { assetInputProps, assets: outputAssets } = useAssetListSearch(outputAssetList, {
    thorchainPriority: true,
  });

  const [slippage, setSlippage] = useState(10);
  const [collateralAsset, setCollateralAsset] = useState(getSignatureAssetFor(Chain.Ethereum));
  const [amount, setAmount] = useState(Amount.fromAssetAmount(0, collateralAsset.decimal));
  const [borrowAsset, setBorrowAsset] = useState(
    AssetEntity.fromAssetString(ETH_USDC_IDENTIFIER) as AssetEntity,
  );
  const [recipient, setRecipient] = useState('');

  const [collateralBalance, setCollateralBalance] = useState<Amount | undefined>();
  const [borrowBalance, setBorrowBalance] = useState<Amount | undefined>();

  const collateralLendingAsset = useMemo(() => {
    return lendingAssets.find((asset) => asset.asset.eq(collateralAsset));
  }, [collateralAsset, lendingAssets]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(LendingTab.Borrow);
  const [viewTab, setViewTab] = useState(LendingViewTab.Borrow);
  const { data: tokenPricesData } = useTokenPrices([collateralAsset, borrowAsset]);
  const collateralUsdPrice = useMemo(() => {
    const price = tokenPricesData[collateralAsset.symbol]?.price_usd || 0;

    return price * amount.assetAmount.toNumber();
  }, [amount.assetAmount, collateralAsset.symbol, tokenPricesData]);

  const formatPrice = useFormatPrice();

  const { refreshLoans, totalBorrowed, totalCollateral, loansData, isLoading } = useLoans();

  const { estimateTimeFromBlocks } = useTCBlockTimer();

  const collateralAddress = useMemo(
    () => wallet?.[collateralAsset.L1Chain]?.address || '',
    [wallet, collateralAsset.L1Chain],
  );
  const borrowAddress = useMemo(
    () => wallet?.[borrowAsset.L1Chain]?.address || '',
    [wallet, borrowAsset.L1Chain],
  );

  useEffect(() => {
    setRecipient(borrowAddress || '');
  }, [borrowAddress]);

  const {
    expectedDebt,
    expectedOutput,
    hasError,
    borrowQuote,
    collateralAmount,
    isFetching,
    totalFeeUsd,
    stream,
    canStream,
    toggleStream,
  } = useBorrow({
    slippage,
    senderAddress: collateralAddress,
    recipientAddress: recipient,
    amount: amount.assetAmount.toNumber(),
    assetIn: collateralAsset,
    assetOut: borrowAsset,
  });
  const borrowUsdPrice = usePoolAssetPriceInUsd({
    asset: borrowAsset,
    amount: expectedOutput,
  });

  useEffect(() => {
    collateralAddress
      ? getMaxBalance(collateralAsset).then((maxBalance) => setCollateralBalance(maxBalance))
      : setCollateralBalance(undefined);
  }, [collateralAddress, collateralAsset, getMaxBalance]);

  useEffect(() => {
    borrowAddress
      ? getMaxBalance(borrowAsset).then((maxBalance) => setBorrowBalance(maxBalance))
      : setBorrowBalance(undefined);
  }, [borrowAddress, borrowAsset, getMaxBalance]);

  const expectedDebtInfo = useMemo(
    () => formatPrice(expectedDebt.gt(0) ? expectedDebt : 0),
    [expectedDebt, formatPrice],
  );

  const handleSwapkitAction = useCallback(async () => {
    const { openLoan, validateAddress } = await (
      await import('services/swapKit')
    ).getSwapKitClient();

    const validAddress = validateAddress({ chain: borrowAsset.L1Chain, address: recipient });
    if (typeof validAddress === 'boolean' && !validAddress) {
      throw new Error('Invalid recipient address');
    }

    if (!borrowQuote) {
      throw new Error('Invalid lending quote');
    }

    const params = {
      assetAmount: new AssetAmount(collateralAsset, amount),
      assetTicker: `${borrowAsset.getAssetObj().chain}.${borrowAsset.getAssetObj().ticker}`,
      memo: stream ? borrowQuote.calldata.memoStreamingSwap : borrowQuote.calldata.memo,
    };

    return openLoan({ ...params });
  }, [amount, borrowAsset, borrowQuote, collateralAsset, recipient, stream]);

  const handleBorrowSubmit = useCallback(
    async (expectedAmount: string) => {
      setIsConfirmOpen(false);

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          label: t('txManager.openLoan', {
            asset: collateralAsset.name,
            amount: expectedAmount,
          }),
          type: TransactionType.TC_LENDING_OPEN,
          inChain: collateralAsset.L1Chain,
        }),
      );

      try {
        const txid = await handleSwapkitAction();
        setAmount(Amount.fromAssetAmount(0, collateralAsset.decimal));
        if (txid)
          appDispatch(
            updateTransaction({
              id,
              txid,
              timestamp: new Date(),
              advancedTracker: true,
              initialPayload: borrowQuote
                ? { isLending: true, ...borrowQuote, fromAddress: collateralAddress }
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
      collateralAddress,
      collateralAsset.L1Chain,
      collateralAsset.decimal,
      collateralAsset.name,
      handleSwapkitAction,
    ],
  );

  const buttonDisabled = useMemo(
    () =>
      !recipient ||
      isLendingPaused ||
      amount.lte(Amount.fromAssetAmount(0, collateralAsset.decimal)) ||
      (collateralBalance && amount.gt(collateralBalance)) ||
      isChainHalted[collateralAsset.L1Chain],
    [
      recipient,
      isLendingPaused,
      amount,
      collateralAsset.decimal,
      collateralAsset.L1Chain,
      collateralBalance,
      isChainHalted,
    ],
  );

  const tabLabel = tab === LendingTab.Borrow ? t('common.borrow') : t('pcommon.repay');
  const selectedCollateralAsset = useMemo(
    () => ({
      asset: collateralAsset,
      value: amount,
      balance: collateralBalance,
      usdPrice: collateralUsdPrice,
    }),
    [collateralAsset, amount, collateralBalance, collateralUsdPrice],
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

  const buttonLabel = useMemo(() => {
    if (!recipient) {
      return t('views.swap.connectOrFillRecipient');
    }

    if (!borrowQuote) {
      return t('views.swap.noValidQuote');
    }

    return tabLabel;
  }, [borrowQuote, recipient, tabLabel]);

  const maturityDays = useMemo(
    () => dayjs.duration(estimateTimeFromBlocks(MATURITY_BLOCKS)).asDays(),
    [estimateTimeFromBlocks],
  );

  const summary = useMemo(
    () => [
      {
        label: t('views.lending.expectedDebt'),
        value: `${expectedDebtInfo}`,
      },
      {
        label: t('views.lending.borrowFee'),
        value: (
          <VirtualDepthSlippageInfo
            depth={collateralLendingAsset?.derivedDepthPercentage || 0}
            totalFeeUsd={totalFeeUsd}
          />
        ),
      },
      {
        label: t('views.lending.repayMaturity'),
        value: (
          <Box center>
            <InfoWithTooltip
              tooltip={t('views.lending.maturityDescription', { days: maturityDays })}
              value={
                <Text textStyle="caption">
                  {maturityDays} {t('views.savings.days')}
                </Text>
              }
            />
          </Box>
        ),
      },
      {
        label: t('views.lending.lendingFee'),
        value: (
          <Text textStyle="caption" variant="green">
            FREE
          </Text>
        ),
      },
    ],
    [collateralLendingAsset?.derivedDepthPercentage, expectedDebtInfo, maturityDays, totalFeeUsd],
  );

  const handleAmountChange = useCallback(
    (amount: Amount) => {
      /**
       * NOTE: This will only work for signature assets for which we specify decimal by hand in SwapKit
       *      For other assets, we need to get decimal from the API / Contract
       */
      setAmount(Amount.fromAssetAmount(amount.assetAmount, collateralAsset.decimal));
    },
    [collateralAsset.decimal],
  );

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <Helmet
        content="Deposit and borrow native assets with THORSwap LENDING"
        keywords="Borrow, Lending, THORSwap, APY, Native assets"
        title={t('views.lending.borrow')}
      />

      {isLendingPaused && (
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
            <Flex direction="column" gap={3} maxWidth="480px" mx="auto">
              <Box className="flex w-full justify-between">
                <Box alignCenter>
                  <Text className="ml-3 mr-2" textStyle="h3">
                    {t('views.lending.header', { asset: borrowAsset.name })}
                  </Text>
                </Box>
              </Box>

              <Flex direction="row" justify="space-between">
                <Flex alignItems="center" direction="row" flexWrap="wrap" gap={1} px={3}>
                  <Text fontWeight="medium" noOfLines={1} textStyle="body" variant="primary">
                    {t('views.lending.liquidationDisclaimer', {
                      asset: collateralAsset.name,
                      borrowAsset: borrowAsset.name,
                    })}
                  </Text>
                  <Link className="text-twitter-blue cursor-pointer" to={LENDING_DOCS}>
                    <Text fontWeight="medium" noOfLines={1} textStyle="caption" variant="blue">
                      {`${t('common.learnMore')} →`}
                    </Text>
                  </Link>
                </Flex>

                <GlobalSettingsPopover>
                  <Box>
                    <Text textStyle="caption">{t('views.swap.transactionSettings')}</Text>
                  </Box>

                  <Box className="space-x-2">
                    <Text textStyle="caption-xs" variant="secondary">
                      {t('views.swap.slippageTolerance')}
                    </Text>
                  </Box>

                  <Box alignCenter className="w-full space-x-2">
                    <Input
                      stretch
                      border="rounded"
                      className="text-right"
                      containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
                      onChange={(e) => setSlippage(Number(e.target.value))}
                      placeholder={t('common.percentage')}
                      symbol="%"
                      type="number"
                      value={slippage}
                    />

                    {slippageOptions.map(({ value, text }) => (
                      <Button
                        key={value}
                        onClick={() => setSlippage(value)}
                        size="sm"
                        variant={slippage === value ? 'primary' : 'outlineTint'}
                      >
                        <Text textStyle="caption-xs">{text}</Text>
                      </Button>
                    ))}
                  </Box>
                </GlobalSettingsPopover>
              </Flex>

              <Box row className="justify-center gap-5">
                <Box col className={classNames('flex h-full')}>
                  <Card
                    className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto max-w-[440px]"
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
                            {t('views.lending.collateral')}
                          </Text>
                        </Flex>

                        <AssetInput
                          noFilters
                          AssetListComponent={BorrowAssetSelectList}
                          assets={lendingAssets}
                          className="flex-1 !py-1"
                          displayAssetTypeComponent={
                            <Box center className="gap-1">
                              <Text
                                fontWeight="light"
                                textStyle="caption"
                                textTransform="uppercase"
                                variant="secondary"
                              >
                                LTV
                              </Text>

                              <Text textStyle="caption" variant="primaryBtn">
                                {collateralLendingAsset?.ltvPercentage
                                  ? `${collateralLendingAsset.ltvPercentage}%`
                                  : 'N/A'}
                              </Text>
                            </Box>
                          }
                          onAssetChange={setCollateralAsset}
                          onValueChange={handleAmountChange}
                          poolAsset={selectedCollateralAsset}
                          selectedAsset={selectedCollateralAsset}
                        />
                      </Flex>

                      <Flex direction="column" mb={2}>
                        <Text mb={1} ml={5} textStyle="caption">
                          {t('views.lending.borrow')}
                        </Text>

                        <AssetInput
                          {...assetInputProps}
                          disabled
                          assets={outputAssets
                            .filter(isLedgerLiveSupportedInputAsset)
                            .filter((outputAsset) => outputAsset.asset.type !== 'Synth')}
                          className="flex-1 !py-1"
                          onAssetChange={setBorrowAsset}
                          poolAsset={selectedBorrowAsset}
                          selectedAsset={selectedBorrowAsset}
                        />

                        {!!collateralAddress && (
                          <Flex alignContent="stretch" flex={1} mt={1}>
                            <CustomRecipientInput
                              isOutputWalletConnected={!!borrowAddress}
                              outputAssetL1Chain={borrowAsset.L1Chain}
                              recipient={recipient}
                              setRecipient={setRecipient}
                            />
                          </Flex>
                        )}
                      </Flex>

                      <TxOptimizeSection
                        canStream={canStream}
                        outputAsset={borrowAsset}
                        quote={borrowQuote}
                        stream={stream}
                        toggleStream={toggleStream}
                      />

                      <InfoTable horizontalInset items={summary} size="sm" />

                      <ActionButton
                        address={collateralAddress}
                        disabled={buttonDisabled}
                        handleSubmit={() => setIsConfirmOpen(true)}
                        hasError={!amount || hasError || isLendingPaused}
                        label={buttonLabel}
                        loading={isFetching}
                        setIsConnectModalOpen={setIsConnectModalOpen}
                      />
                    </Flex>
                  </Card>

                  <BorrowConfirmModal
                    amount={amount}
                    asset={borrowAsset}
                    collateralAmount={collateralAmount}
                    collateralAsset={collateralAsset}
                    estimatedTime={borrowQuote?.estimatedTime}
                    expectedDebtInfo={expectedDebtInfo}
                    expectedOutputAmount={expectedOutput}
                    isOpened={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={handleBorrowSubmit}
                  />
                </Box>
              </Box>
            </Flex>
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
