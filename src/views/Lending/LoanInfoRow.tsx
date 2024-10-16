import { Card, Collapse, Flex, Text } from "@chakra-ui/react";
import { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { AssetSelect } from "components/AssetSelect";
import { AssetSelectButton } from "components/AssetSelect/AssetSelectButton";
import { Button, Icon } from "components/Atomic";
import { InfoRow } from "components/InfoRow";
import { InfoTip } from "components/InfoTip";
import { InputAmount } from "components/InputAmount";
import { PercentageSlider } from "components/PercentageSlider";
import { showErrorToast } from "components/Toast";
import { formatDuration } from "components/TransactionTracker/helpers";
import { TxOptimizeSection } from "components/TxOptimize/TxOptimizeSection";
import { useWallet, useWalletConnectModal } from "context/wallet/hooks";
import { useAssetsWithBalance } from "hooks/useAssetsWithBalance";
import { useBalance } from "hooks/useBalance";
import { useDebouncedValue } from "hooks/useDebouncedValue";
import { useTCApprove } from "hooks/useTCApprove";
import { useTCBlockTimer } from "hooks/useTCBlockTimer";
import { useTokenPrices } from "hooks/useTokenPrices";
import type { MouseEventHandler } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { t } from "services/i18n";
import { MATURITY_BLOCKS } from "views/Lending/Borrow";
import { LendingConfirmModal } from "views/Lending/LendingConfirmModal";
import { LoanInfoRowCell } from "views/Lending/LoanInfoRowCell";
import { HIGH_LENDING_SLIPPAGE } from "views/Lending/constants";
import type { LoanPosition } from "views/Lending/types";
import { useLoanRepay } from "views/Lending/useLoanRepay";
import { useRepayQuote } from "views/Lending/useRepayQuote";
import { ApproveModal } from "views/Swap/ApproveModal";
import { useIsAssetApproved } from "views/Swap/hooks/useIsAssetApproved";

type Props = {
  loan: LoanPosition;
  setBorrowTab: () => void;
  setCollateralAsset: (value: AssetValue) => void;
};

export const LoanInfoRow = ({
  loan: { collateralCurrent, debtCurrent, asset, lastOpenHeight },
  setBorrowTab,
  setCollateralAsset,
}: Props) => {
  const [show, setShow] = useState(false);
  const [visibleApproveModal, setVisibleApproveModal] = useState(false);
  const [sliderValue, setSliderValue] = useState(new SwapKitNumber({ decimal: 2, value: 0 }));
  const [repayBalance, setRepayBalance] = useState<AssetValue>();
  const [repayAsset, setRepayAsset] = useState(
    AssetValue.from({ asset: "ETH.USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }),
  );

  const { getBlockTimeDifference } = useTCBlockTimer();
  const { getMaxBalance } = useBalance();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { getWalletAddress } = useWallet();
  const repayAssets = useAssetsWithBalance({ includeRune: true });
  const { data: tokenPricesData } = useTokenPrices([asset, repayAsset]);

  const handleToggle: MouseEventHandler<HTMLButtonElement> = useCallback((e) => {
    e.stopPropagation();
    setShow((v) => !v);
  }, []);

  const debouncedPercentage = useDebouncedValue(sliderValue, 500);
  const missingTimeToRepayInMS = getBlockTimeDifference(lastOpenHeight + MATURITY_BLOCKS);
  const repayAddress = useMemo(
    () => getWalletAddress(repayAsset.chain),
    [getWalletAddress, repayAsset.chain],
  );

  const hasLoanMatured = missingTimeToRepayInMS <= 0;
  const {
    repayAssetAmount,
    isLoading,
    repayQuote,
    stream,
    canStream,
    toggleStream,
    repayOptimizeQuoteDetails,
    repaySlippage,
    repayDebtAmount,
    totalFeeUsd,
  } = useRepayQuote({
    asset: repayAsset,
    collateralAsset: asset,
    percentage: debouncedPercentage,
    totalAmount: debtCurrent,
    hasLoanMatured,
  });

  const { isApproved, isLoading: isLoadingApproval } = useIsAssetApproved({
    assetValue: repayAsset.set(repayAssetAmount.getValue("string")),
    force: true,
  });

  const handleApprove = useTCApprove({ asset: repayAsset });

  const collateralUsd = useMemo(() => {
    const price = tokenPricesData[asset.toString()]?.price_usd || 0;

    return collateralCurrent.mul(price).toCurrency("$");
  }, [asset, collateralCurrent, tokenPricesData]);

  const repayAssetString = useMemo(() => repayAsset.toString(), [repayAsset]);
  const repayUsd = useMemo(() => {
    const price = tokenPricesData[repayAssetString]?.price_usd || 0;

    return repayAssetAmount.mul(price).getValue("number");
  }, [repayAssetAmount, repayAssetString, tokenPricesData]);

  useEffect(() => {
    repayAddress
      ? getMaxBalance(repayAsset).then((maxBalance) => setRepayBalance(maxBalance))
      : setRepayBalance(undefined);
  }, [repayAddress, repayAsset, getMaxBalance]);

  const selectedRepayAsset = useMemo(
    () => ({
      asset: repayAsset,
      value: repayAssetAmount,
      balance: repayBalance,
      usdPrice: repayUsd,
    }),
    [repayAsset, repayAssetAmount, repayBalance, repayUsd],
  );

  const canRepay = useMemo(() => {
    if (!hasLoanMatured) return false;
    if (repayAssetAmount.lte(0)) return false;
    if (repayBalance?.lt(repayAssetAmount)) return false;

    return true;
  }, [repayAssetAmount, repayBalance, hasLoanMatured]);

  const onSuccess = useCallback(() => {
    setSliderValue(new SwapKitNumber({ decimal: 2, value: 0 }));
  }, []);

  const { openRepayConfirm, handleRepay, isConfirmOpen, closeRepayConfirm } = useLoanRepay({
    repayAsset,
    collateralAsset: asset,
    amount: repayAssetAmount,
    onSuccess,
    repayQuote,
    stream,
  });

  useEffect(() => {
    if (!hasLoanMatured && debouncedPercentage.gt(0)) {
      showErrorToast(t("views.lending.maturityError"));
    }
  }, [debouncedPercentage, hasLoanMatured]);

  const timeLeft = formatDuration(missingTimeToRepayInMS, { approx: true });

  return (
    <Flex
      alignSelf="stretch"
      direction="column"
      justify="center"
      key={`${asset.symbol} + ${asset.symbol}`}
      w="full"
    >
      <Card
        className="!rounded-3xl flex-col flex !gap-0 !px-3 !py-3"
        variant="filledContainerSecondary"
      >
        <Flex direction={{ base: "column", lg: "row" }} flex={4} gap={2}>
          <Flex flex={5}>
            <LoanInfoRowCell>
              <Flex gap={1}>
                <Flex align="center">
                  <AssetIcon asset={asset} size={36} />
                </Flex>

                <Flex direction="column">
                  <Text>{`${collateralCurrent.toSignificant(4)} ${asset.symbol}`}</Text>
                  <Text>{collateralUsd}</Text>
                </Flex>
              </Flex>
            </LoanInfoRowCell>
            <LoanInfoRowCell>
              <Text textAlign="end">{`$${debtCurrent.toFixed(2)}`}</Text>
            </LoanInfoRowCell>
            <LoanInfoRowCell>
              <Text variant={hasLoanMatured ? "green" : "primary"}>
                {hasLoanMatured ? t("views.lending.repayAvailable") : timeLeft}
              </Text>
            </LoanInfoRowCell>
          </Flex>
          <Flex
            align="center"
            direction="row"
            flex={{ md: 2, lg: 3, xl: 3 }}
            gap={2}
            justify="end"
            mt={{ base: 2, md: 0 }}
            pl={{ md: 4, lg: 8 }}
          >
            <Button
              flex={1}
              onClick={(e) => {
                e.stopPropagation();
                setBorrowTab();
                setCollateralAsset(asset);
              }}
              variant="outlinePrimary"
            >
              {t("views.lending.borrow")}
            </Button>

            <Button
              flex={1}
              onClick={handleToggle}
              rightIcon={
                <Icon
                  className={classNames({
                    "-rotate-180": show,
                  })}
                  name="chevronDown"
                  size={14}
                />
              }
              variant="outlineSecondary"
            >
              {t("views.lending.repay")}
            </Button>

            {/* <Button
              disabled
              flex={1}
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant="outlineSecondary"
            >
              {t('views.lending.withdraw')}
            </Button> */}
          </Flex>
        </Flex>
        <Collapse in={show}>
          <Flex align="center" flex={1} justify="center" w="full">
            <Card
              bg="borderPrimary"
              borderRadius="3xl"
              mt={{ base: 2, md: 4 }}
              variant="filledContainerPrimary"
              w="full"
            >
              <Flex align="center" direction="column" display="flex" flex={1} justify="center">
                <Flex
                  alignSelf="stretch"
                  direction={{ base: "column", lg: "row" }}
                  flex={1}
                  gap={{ base: 4, lg: 8 }}
                >
                  <Flex direction="column" flex={1}>
                    <Flex alignItems="center" justifyContent="space-between">
                      <Text textStyle="caption">{t("views.lending.repayAsset")}:</Text>
                      <AssetSelect
                        showAssetType
                        assets={repayAssets}
                        onSelect={setRepayAsset as (asset: AssetValue) => void}
                        selected={selectedRepayAsset.asset}
                      />
                    </Flex>
                    <PercentageSlider
                      highlightDisabled
                      className="!p-0"
                      onChange={setSliderValue}
                      percent={sliderValue}
                      slideClassName="!pb-0"
                      title={t("views.lending.repayPercent")}
                    />

                    <TxOptimizeSection
                      canStream={canStream}
                      outputAsset={selectedRepayAsset.asset}
                      quote={repayOptimizeQuoteDetails}
                      stream={stream}
                      title={t("views.lending.txOptimizeTitle")}
                      toggleStream={toggleStream}
                    />
                  </Flex>

                  <Flex direction="column" flex={1}>
                    <Flex alignItems="center" minH="40px">
                      <Text textStyle="caption">{t("views.lending.repayAmount")}:</Text>
                    </Flex>

                    <Flex>
                      <Flex flex={1} justifyContent="space-between">
                        {isLoading ? (
                          <Flex alignItems="center" minH="44px">
                            <Icon spin color="primary" name="loader" size={22} />
                          </Flex>
                        ) : (
                          <InputAmount
                            disabled
                            amountValue={repayAssetAmount}
                            className="!text-2xl  pt-[1.5px] md:!w-full"
                          />
                        )}
                      </Flex>

                      <AssetSelectButton
                        showAssetType
                        className="cursor-default p-2"
                        selected={selectedRepayAsset.asset}
                      />
                    </Flex>

                    <Flex mt={3}>
                      <Flex flex={1} justifyContent="space-between">
                        {isLoading ? (
                          <Flex alignItems="center" minH="21px">
                            <Icon spin color="secondary" name="loader" size={16} />
                          </Flex>
                        ) : (
                          <Text variant="secondary">{selectedRepayAsset.usdPrice.toFixed(2)}</Text>
                        )}

                        <Flex mr={4}>
                          <Text variant="secondary">
                            {t("common.balance")}:{" "}
                            {selectedRepayAsset.balance?.toSignificant(6) || "0"}
                          </Text>
                        </Flex>
                      </Flex>
                    </Flex>

                    {!!repayQuote && (
                      <Flex direction="column">
                        <Flex className="border-0 border-t border-solid border-bottom border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20 mt-3 mb-1" />
                        <InfoRow
                          label="Repay Slippage"
                          showBorder={false}
                          size="sm"
                          value={totalFeeUsd.toCurrency()}
                        />
                      </Flex>
                    )}

                    {repaySlippage > HIGH_LENDING_SLIPPAGE && (
                      <Flex mt={3}>
                        <InfoTip
                          title={
                            <Text color="brand.yellow" mx={2} textStyle="caption">
                              {t("views.lending.slippageRepayWarning")}
                            </Text>
                          }
                          type="warn"
                        />
                      </Flex>
                    )}
                  </Flex>
                </Flex>

                {repayAssetAmount.getValue("number") > 0 && (!isApproved || isLoadingApproval) ? (
                  <Button
                    stretch
                    disabled={isLoadingApproval}
                    loading={isLoadingApproval}
                    mt={6}
                    onClick={() => setVisibleApproveModal(true)}
                    size="md"
                    variant="fancy"
                  >
                    {t("common.approve")}
                  </Button>
                ) : (
                  <Button
                    stretch
                    disabled={!canRepay}
                    error={!canRepay}
                    mt={6}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!repayAddress) {
                        setIsConnectModalOpen(true);
                        return;
                      }

                      openRepayConfirm();
                    }}
                    size="md"
                    variant="fancy"
                  >
                    {repayAddress ? t("views.lending.repay") : t("common.connectWallet")}
                  </Button>
                )}
              </Flex>
            </Card>
          </Flex>
        </Collapse>
      </Card>

      <ApproveModal
        handleApprove={handleApprove}
        inputAsset={repayAsset}
        setVisible={setVisibleApproveModal}
        visible={visibleApproveModal}
      />

      <LendingConfirmModal
        amount={repayAssetAmount}
        asset={repayAsset}
        expectedOutputAmount={repayAssetAmount}
        inputAmount={repayDebtAmount}
        isOpened={isConfirmOpen}
        onClose={closeRepayConfirm}
        onConfirm={handleRepay}
        slippagePercent={repaySlippage}
        tabLabel={t("views.lending.repay")}
      />
    </Flex>
  );
};
