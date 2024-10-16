import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import classNames from "classnames";
import { Announcement } from "components/Announcements/Announcement/Announcement";
import { AssetInput } from "components/AssetInput";
import { Box, Button, Card, Icon, Link, Switch, Tooltip } from "components/Atomic";
import { GlobalSettingsPopover } from "components/GlobalSettings";
import { Helmet } from "components/Helmet";
import { InfoTable } from "components/InfoTable";
import { InfoTip } from "components/InfoTip";
import { InfoWithTooltip } from "components/InfoWithTooltip";
import { Input } from "components/Input";
import { showErrorToast } from "components/Toast";
import { TxOptimizeSection } from "components/TxOptimize/TxOptimizeSection";
import { useWallet, useWalletConnectModal } from "context/wallet/hooks";
import dayjs from "dayjs";
import { ETHAsset } from "helpers/assets";
import { useAssetListSearch } from "hooks/useAssetListSearch";
import { useBalance } from "hooks/useBalance";
import { useMimir } from "hooks/useMimir";
import { useRouteAssetParams } from "hooks/useRouteAssetParams";
import { useTCBlockTimer } from "hooks/useTCBlockTimer";
import { useTokenPrices } from "hooks/useTokenPrices";
import { useCallback, useEffect, useMemo, useState } from "react";
import { t } from "services/i18n";
import { logException } from "services/logger";
import { ROUTES } from "settings/router";
import { useApp } from "store/app/hooks";
import { AnnouncementType } from "store/externalConfig/types";
import { useAppDispatch } from "store/store";
import { addTransaction, completeTransaction, updateTransaction } from "store/transactions/slice";
import { TransactionType } from "store/transactions/types";
import { v4 } from "uuid";
import { BorrowAssetSelectList } from "views/Lending/BorrowAssetSelectList";
import { BorrowConfirmModal } from "views/Lending/BorrowConfirmModal";
import { VirtualDepthSlippageInfo } from "views/Lending/VirtualDepthSippageInfo";
import { HIGH_LENDING_SLIPPAGE } from "views/Lending/constants";
import { useLendingAssets } from "views/Lending/useLendingAssets";
import { useLoans } from "views/Lending/useLoans";
import { CustomRecipientInput } from "views/Swap/CustomRecipientInput";
import { useAssetsWithBalanceFromTokens } from "views/Swap/hooks/useAssetsWithBalanceFromTokens";
import { useTokenList } from "views/Swap/hooks/useTokenList";

import { isLedgerLiveSupportedInputAsset } from "../../../ledgerLive/wallet/LedgerLive";

import { ActionButton } from "./ActionButton";
import { BorrowPositionsTab } from "./BorrowPositionsTab";
import { LendingTab, LendingViewTab } from "./types";
import { useBorrow } from "./useBorrow";

export const LENDING_DOCS = "https://docs.thorchain.org/thorchain-finance/lending";
export const ETH_USDC_IDENTIFIER = "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48";
export const MATURITY_BLOCKS = 432000;
const MANUAL_PAUSE = false;

export const slippageOptions = [
  { value: 1, text: "1%" },
  { value: 3, text: "3%" },
  { value: 5, text: "5%" },
  { value: 10, text: "10%" },
];

const Borrow = () => {
  const appDispatch = useAppDispatch();
  const lendingAssets = useLendingAssets();
  const { getMaxBalance } = useBalance();
  const { isChainHalted } = useMimir();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWalletAddress } = useWallet();

  const { customRecipientMode, setCustomRecipientMode } = useApp();

  const { isLendingPaused } = useMimir();

  // output assets
  const { tokens } = useTokenList();
  const outputAssetList = useAssetsWithBalanceFromTokens(tokens, true);
  const { assetInputProps, assets: outputAssets } = useAssetListSearch(outputAssetList, {
    thorchainPriority: true,
  });

  const [slippage, setSlippage] = useState(10);

  const {
    asset: collateralAsset,
    setAsset: setCollateralAsset,
    amount,
    setAmount,
  } = useRouteAssetParams(ROUTES.Lending, ETHAsset);

  const [borrowAsset, setBorrowAsset] = useState(
    AssetValue.from({ asset: "ETH.USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }),
  );
  const [recipient, setRecipient] = useState("");

  const [collateralBalance, setCollateralBalance] = useState<AssetValue | undefined>();
  const [borrowBalance, setBorrowBalance] = useState<AssetValue | undefined>();

  const collateralLendingAsset = useMemo(() => {
    return lendingAssets.find((asset) => asset.asset.eqAsset(collateralAsset));
  }, [collateralAsset, lendingAssets]);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [tab, setTab] = useState(LendingTab.Borrow);
  const [viewTab, setViewTab] = useState(LendingViewTab.Borrow);
  const { data: tokenPricesData } = useTokenPrices([collateralAsset, borrowAsset]);
  const [isValidRecipient, setIsValidRecipient] = useState(true);
  const collateralUsdPrice = useMemo(() => {
    const price = tokenPricesData[collateralAsset.toString()]?.price_usd || 0;

    return price * amount.getValue("number");
  }, [amount, collateralAsset, tokenPricesData]);

  const { refreshLoans, totalBorrowed, totalCollateral, loansData, isLoading } = useLoans();

  const { estimateTimeFromBlocks } = useTCBlockTimer();

  const estimatedLoanSizeUsd = useMemo(() => {
    return (Number(collateralLendingAsset?.ltvPercentage) * collateralUsdPrice) / 100;
  }, [collateralLendingAsset?.ltvPercentage, collateralUsdPrice]);

  const collateralAddress = useMemo(
    () => getWalletAddress(collateralAsset.chain),
    [getWalletAddress, collateralAsset.chain],
  );
  const borrowAddress = useMemo(
    () => getWalletAddress(borrowAsset.chain),
    [getWalletAddress, borrowAsset.chain],
  );

  useEffect(() => {
    setRecipient(borrowAddress || "");
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
    expectedOutputAssetValue,
    borrowSlippage,
    exchangeFeeUsd,
  } = useBorrow({
    slippage,
    senderAddress: collateralAddress,
    recipientAddress: recipient,
    amount,
    assetIn: collateralAsset,
    assetOut: borrowAsset,
    estimatedLoanSizeUsd,
  });

  const borrowUsdPrice = useMemo(() => {
    const price = tokenPricesData[borrowAsset.toString()]?.price_usd || 0;

    return price * Number(expectedOutput.toFixed(2)) || 0;
  }, [borrowAsset, expectedOutput, tokenPricesData]);

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
    () => (expectedDebt?.gt(0) ? expectedDebt?.toCurrency() : "-"),
    [expectedDebt],
  );

  const handleSwapkitAction = useCallback(async () => {
    const { thorchain, validateAddress } = await (
      await import("services/swapKit")
    ).getSwapKitClient();
    if (!thorchain) throw new Error("SwapKit client not found");

    const validAddress = validateAddress({ chain: borrowAsset.chain, address: recipient });
    if (typeof validAddress === "boolean" && !validAddress) {
      throw new Error("Invalid recipient address");
    }

    if (!borrowQuote) {
      throw new Error("Invalid lending quote");
    }

    return thorchain.loan({
      type: "open",
      assetValue: collateralAsset.add(amount),
      minAmount: borrowAsset.add(expectedOutput),
      memo: stream
        ? borrowQuote.streamingSwap?.memo || borrowQuote.calldata?.memoStreamingSwap
        : borrowQuote.memo,
    });
  }, [amount, borrowAsset, borrowQuote, collateralAsset, expectedOutput, recipient, stream]);
  const handleBorrowSubmit = useCallback(
    async (expectedAmount: string) => {
      setIsConfirmOpen(false);

      const id = v4();
      appDispatch(
        addTransaction({
          id,
          label: t("txManager.openLoan", {
            asset: collateralAsset.ticker,
            amount: expectedAmount,
          }),
          type: TransactionType.TC_LENDING_OPEN,
          inChain: collateralAsset.chain,
        }),
      );

      try {
        const txid = await handleSwapkitAction();
        setAmount(new SwapKitNumber({ value: 0, decimal: collateralAsset.decimal }));
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
        logException(error as Error);
        showErrorToast(t("txManager.failed"), undefined, undefined, error as Error);
        appDispatch(completeTransaction({ id, status: "error" }));
      }
    },
    [
      appDispatch,
      borrowQuote,
      collateralAddress,
      collateralAsset.chain,
      collateralAsset.decimal,
      collateralAsset.ticker,
      handleSwapkitAction,
      setAmount,
    ],
  );

  const buttonDisabled = useMemo(
    () =>
      !(recipient && isValidRecipient) ||
      isLendingPaused ||
      MANUAL_PAUSE ||
      amount.lte(0) ||
      (collateralBalance && amount.gt(collateralBalance)) ||
      isChainHalted[collateralAsset.chain],
    [
      recipient,
      isLendingPaused,
      amount,
      collateralAsset.chain,
      collateralBalance,
      isChainHalted,
      isValidRecipient,
    ],
  );

  const tabLabel = tab === LendingTab.Borrow ? t("common.borrow") : t("common.repay");
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
      asset: expectedOutputAssetValue ? expectedOutputAssetValue : borrowAsset,
      value: expectedOutput,
      balance: borrowBalance,
      usdPrice: borrowUsdPrice,
    }),
    [expectedOutputAssetValue, borrowAsset, expectedOutput, borrowBalance, borrowUsdPrice],
  );

  const buttonLabel = useMemo(() => {
    if (!recipient) {
      return t("views.swap.connectOrFillRecipient");
    }

    if (!borrowQuote) {
      return t("views.swap.noValidQuote");
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
        label: t("views.lending.expectedDebt"),
        value: `${expectedDebtInfo}`,
      },
      {
        label: t("views.lending.borrowSlippage"),
        value: (
          <VirtualDepthSlippageInfo
            depth={collateralLendingAsset?.derivedDepthPercentage || 0}
            slippagePercent={borrowSlippage}
            totalFeeUsd={totalFeeUsd}
          />
        ),
      },
      {
        label: t("views.lending.repayMaturity"),
        value: (
          <Box center>
            <InfoWithTooltip
              tooltip={t("views.lending.maturityDescription", { days: maturityDays })}
              value={
                <Text textStyle="caption">
                  {maturityDays} {t("views.savings.days")}
                </Text>
              }
            />
          </Box>
        ),
      },
      {
        label: t("views.lending.exchangeFee"),
        value: exchangeFeeUsd.gt(0) ? (
          <Text textStyle="caption">{exchangeFeeUsd.toCurrency()}</Text>
        ) : (
          <Text textStyle="caption" variant="green">
            FREE
          </Text>
        ),
      },
    ],
    [
      borrowSlippage,
      collateralLendingAsset?.derivedDepthPercentage,
      expectedDebtInfo,
      exchangeFeeUsd,
      maturityDays,
      totalFeeUsd,
    ],
  );

  const handleAmountChange = useCallback(
    (updatedAmount: SwapKitNumber) => {
      /**
       * NOTE: This will only work for signature assets for which we specify decimal by hand in SwapKit
       *      For other assets, we need to get decimal from the API / Contract
       */
      setAmount(updatedAmount);
    },
    [setAmount],
  );

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <Helmet
        content="Deposit and borrow native assets with THORSwap LENDING"
        keywords="Borrow, Lending, THORSwap, APY, Native assets"
        title={t("views.lending.borrow")}
      />

      {(isLendingPaused || MANUAL_PAUSE) && (
        <Announcement
          announcement={{ type: AnnouncementType.Error, message: t("views.lending.lendingPaused") }}
          showClose={false}
        />
      )}

      <Tabs index={viewTab} onChange={setViewTab}>
        <TabList>
          <Tab>{t("views.lending.borrow")}</Tab>
          <Tab>{t("views.lending.myLoans")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Flex direction="column" gap={3} maxWidth="480px" mx="auto">
              <Box className="flex w-full justify-between">
                <Box alignCenter>
                  <Text className="ml-3 mr-2" textStyle="h3">
                    {t("views.lending.header", { asset: borrowAsset.ticker })}
                  </Text>
                </Box>
              </Box>

              <Flex direction="row" justify="space-between">
                <Flex alignItems="center" direction="row" flexWrap="wrap" gap={1} px={3}>
                  <Text fontWeight="medium" noOfLines={1} textStyle="body" variant="primary">
                    {t("views.lending.liquidationDisclaimer", {
                      asset: collateralAsset.ticker,
                      borrowAsset: borrowAsset.ticker,
                    })}
                  </Text>
                  <Link className="text-twitter-blue cursor-pointer" to={LENDING_DOCS}>
                    <Text fontWeight="medium" noOfLines={1} textStyle="caption" variant="blue">
                      {`${t("common.learnMore")} →`}
                    </Text>
                  </Link>
                </Flex>

                <GlobalSettingsPopover>
                  <Box>
                    <Text textStyle="caption">{t("views.swap.transactionSettings")}</Text>
                  </Box>

                  <Box className="space-x-2">
                    <Text textStyle="caption-xs" variant="secondary">
                      {t("views.swap.slippageTolerance")}
                    </Text>
                  </Box>

                  <Box alignCenter className="w-full space-x-2">
                    <Input
                      stretch
                      border="rounded"
                      className="text-right"
                      containerClassName="bg-light-gray-light dark:bg-dark-gray-light bg-opacity-40"
                      onChange={(e) => setSlippage(Number(e.target.value))}
                      placeholder={t("common.percentage")}
                      symbol="%"
                      type="number"
                      value={slippage}
                    />

                    {slippageOptions.map(({ value, text }) => (
                      <Button
                        key={value}
                        onClick={() => setSlippage(value)}
                        size="sm"
                        variant={slippage === value ? "primary" : "outlineTint"}
                      >
                        <Text textStyle="caption-xs">{text}</Text>
                      </Button>
                    ))}
                  </Box>

                  <>
                    <Box>
                      <Text textStyle="caption">{t("views.setting.transactionMode")}</Text>
                    </Box>

                    <Box alignCenter justify="between">
                      <Box alignCenter className="space-x-2">
                        <Text textStyle="caption-xs" variant="secondary">
                          {t("views.setting.customRecipientMode")}
                        </Text>
                        <Tooltip content={t("common.customRecipientTooltip")} place="top">
                          <Icon color="secondary" name="questionCircle" size={16} />
                        </Tooltip>
                      </Box>

                      <Switch
                        checked={customRecipientMode}
                        onChange={() => setCustomRecipientMode(!customRecipientMode)}
                        selectedText="ON"
                        unselectedText="OFF"
                      />
                    </Box>
                  </>
                </GlobalSettingsPopover>
              </Flex>

              <Box row className="justify-center gap-5">
                <Box col className={classNames("flex h-full")}>
                  <Card
                    className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-2 space-y-1 shadow-lg md:w-full md:h-auto max-w-[480px]"
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
                            {t("views.lending.collateral")}
                          </Text>
                        </Flex>

                        <AssetInput
                          noFilters
                          hideZeroPrice
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
                                  : "N/A"}
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
                          {t("views.lending.borrow")}
                        </Text>

                        <AssetInput
                          hideZeroPrice
                          {...assetInputProps}
                          disabled
                          assets={outputAssets
                            .filter((asset) => isLedgerLiveSupportedInputAsset(asset.asset))
                            .filter((outputAsset) => outputAsset.asset.type !== "Synth")}
                          className="flex-1 !py-1"
                          onAssetChange={setBorrowAsset}
                          poolAsset={selectedBorrowAsset}
                          selectedAsset={selectedBorrowAsset}
                        />

                        {!!collateralAddress && (
                          <Flex alignContent="stretch" flex={1} mt={1}>
                            <CustomRecipientInput
                              isOutputWalletConnected={!!borrowAddress}
                              outputAssetChain={borrowAsset.chain}
                              recipient={recipient}
                              setIsValidRecipient={setIsValidRecipient}
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
                        title={t("views.lending.txOptimizeTitle")}
                        toggleStream={toggleStream}
                      />

                      <InfoTable horizontalInset items={summary} size="sm" />

                      {borrowSlippage > HIGH_LENDING_SLIPPAGE && (
                        <Flex mt={3}>
                          <InfoTip
                            title={
                              <Text color="brand.yellow" mx={2} textStyle="caption">
                                {t("views.lending.slippageBorrowWarning")}
                              </Text>
                            }
                            type="warn"
                          />
                        </Flex>
                      )}

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
                    slippagePercent={borrowSlippage}
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
