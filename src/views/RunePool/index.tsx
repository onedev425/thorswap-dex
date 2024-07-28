import { Flex, Text } from "@chakra-ui/react";
import { Chain, SwapKitNumber } from "@swapkit/core";
import { AssetValue, getMemoForRunePoolDeposit, getMemoForRunePoolWithdraw } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { AssetInput } from "components/AssetInput";
import { Box, Button, Card, Icon, Tooltip } from "components/Atomic";
import { HighlightCard } from "components/HighlightCard";
import { InfoRow } from "components/InfoRow";
import type { InfoRowConfig } from "components/InfoRow/types";
import { InfoTable } from "components/InfoTable";
import { InfoTip } from "components/InfoTip";
import { InfoWithTooltip } from "components/InfoWithTooltip";
import { ConfirmModal } from "components/Modals/ConfirmModal";
import { PercentageSlider } from "components/PercentageSlider";
import { TabsSelect } from "components/TabsSelect";
import { useWallet, useWalletConnectModal } from "context/wallet/hooks";
import { RUNEAsset } from "helpers/assets";
import { blockTime } from "helpers/getEstimatedTxTime";
import { useBalance } from "hooks/useBalance";
import { useTokenPrices } from "hooks/useTokenPrices";
import useWindowSize from "hooks/useWindowSize";
import { useCallback, useEffect, useMemo, useState } from "react";
import { t } from "services/i18n";
import { logException } from "services/logger";
import { useAppDispatch } from "store/store";
import { addTransaction, completeTransaction, updateTransaction } from "store/transactions/slice";
import { TransactionType } from "store/transactions/types";
import { zeroAmount } from "types/app";
import { v4 } from "uuid";
import {
  useRunePoolAvailability,
  useRunePoolPosition,
  useRunePoolStats,
} from "views/RunePool/hooks";
import { RunePoolTab } from "views/RunePool/types";

const RunePool = () => {
  const { isLgActive } = useWindowSize();
  const [tab, setTab] = useState(RunePoolTab.Deposit);
  const [withdrawPercent, setWithdrawPercent] = useState(
    new SwapKitNumber({ decimal: 2, value: 0 }),
  );
  const { getMaxBalance } = useBalance();

  const { getWalletAddress } = useWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const {
    availability: { depositAvailability, withdrawalAvailability },
    refreshAvailability,
  } = useRunePoolAvailability();
  const appDispatch = useAppDispatch();

  const { stats, refreshStats } = useRunePoolStats();
  const [amount, setAmount] = useState<SwapKitNumber>(new SwapKitNumber({ value: 0, decimal: 8 }));
  const { position, refreshPosition } = useRunePoolPosition();
  const [balance, setBalance] = useState<AssetValue | undefined>();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const tabs = useMemo(
    () => [
      { label: t("common.deposit"), value: RunePoolTab.Deposit },
      { label: t("common.withdraw"), value: RunePoolTab.Withdraw },
    ],
    [],
  );

  const address = useMemo(() => getWalletAddress(Chain.THORChain), [getWalletAddress]);

  const switchTab = useCallback((tab: RunePoolTab) => {
    setTab(tab);
  }, []);

  const handlePercentWithdrawChange = useCallback((amount: SwapKitNumber) => {
    setWithdrawPercent(amount);
  }, []);

  useEffect(() => {
    address
      ? getMaxBalance(AssetValue.from({ asset: "THOR.RUNE" })).then((maxBalance) =>
          setBalance(maxBalance),
        )
      : setBalance(undefined);
  }, [getMaxBalance, address]);

  const isDeposit = useMemo(() => tab === RunePoolTab.Deposit, [tab]);

  const runePoolDepositMemo = useMemo(() => {
    if (isDeposit) return getMemoForRunePoolDeposit();
    return getMemoForRunePoolWithdraw({
      basisPoints: withdrawPercent.mul(100).getValue("number"),
      affiliateAddress: "t",
      affiliateBasisPoints: 30,
    });
  }, [withdrawPercent, isDeposit]);

  const handleDepositSubmit = useCallback(async () => {
    const { thorchain } = (await import("services/swapKit")).getSwapKitClient();
    if (!thorchain) throw new Error("SwapKit client not found");
    setIsConfirmOpen(false);

    // Dispatch for event for tracking
    const id = v4();
    appDispatch(
      addTransaction({
        id,
        label: t(isDeposit ? "txManager.addAmountAsset" : "txManager.withdrawAmountAsset", {
          asset: RUNEAsset.ticker,
          amount: amount.getValue("string"),
        }),
        type: isDeposit ? TransactionType.TC_RUNEPOOL_ADD : TransactionType.TC_RUNEPOOL_WITHDRAW,
        inChain: RUNEAsset.chain,
      }),
    );

    try {
      const percent = withdrawPercent.getValue("number");
      const params = isDeposit
        ? {
            memo: runePoolDepositMemo,
            assetValue: RUNEAsset.set(amount.getValue("string")),
            type: "add" as const,
          }
        : { assetValue: RUNEAsset, type: "withdraw" as const, percent };

      const txid = await thorchain.deposit({ ...params, recipient: "" });
      setAmount(new SwapKitNumber({ value: 0, decimal: 8 }));
      if (txid) appDispatch(updateTransaction({ id, txid }));
    } catch (error) {
      logException(error as Error);
      appDispatch(completeTransaction({ id, status: "error" }));
    }
  }, [amount, appDispatch, isDeposit, runePoolDepositMemo, withdrawPercent]);

  useEffect(() => {
    refreshStats();
    refreshPosition();
    refreshAvailability();
    setInterval(() => {
      refreshStats();
      refreshPosition();
      refreshAvailability();
    }, 30_000);
  }, [refreshPosition, refreshStats, refreshAvailability]);

  const { data: tokenPrices } = useTokenPrices([position.asset]);

  const amountUsd = useCallback(
    (amount: SwapKitNumber) =>
      `$${(tokenPrices?.[position.asset.toString()]?.price_usd * amount.getValue("number") || 0 * amount.getValue("number")).toFixed(2)}`,
    [tokenPrices, position.asset],
  );

  const infoFields: InfoRowConfig[] = useMemo(
    () => [
      {
        label: "Amount Deposited",
        value: (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.depositAmount)}
            value={`${position.depositAmount.getValue("string")} ${position.asset.ticker}`}
          />
        ),
      },
      {
        label: "Amount Redeemable",
        value: (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.value)}
            value={`${position?.value?.getValue("string")} ${position.asset.ticker}`}
          />
        ),
      },
      {
        label: "Total Earned",
        value: (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.pnl || zeroAmount)}
            value={`${position?.pnl?.getValue("string")} ${position.asset.ticker}`}
          />
        ),
      },
    ],
    [amountUsd, position],
  );

  const runeAsset = useMemo(() => {
    return {
      amount,
      value: amount,
      balance,
      asset: RUNEAsset,
      usdPrice: (tokenPrices?.[RUNEAsset.toString()]?.price_usd || 0) * amount.getValue("number"),
    };
  }, [amount, balance, amountUsd]);

  const txInfos = [
    {
      label: t("common.action"),
      value: t(`common.${isDeposit ? "deposit" : "withdraw"}`),
    },
    {
      label: t("common.asset"),
      value: position.asset.ticker,
      icon: position.asset,
    },
    {
      label: t("views.wallet.estimatedTime"),
      value: `${blockTime.THOR} seconds`,
    },
    {
      label: t("views.wallet.networkFee"),
      value: `0.02 ${runeAsset.asset.ticker}`,
    },
    {
      label: t("common.amount"),
      value: `${amount.toSignificant(6)} ${runeAsset.asset.ticker}`,
    },
  ];

  const handleDepositButtonClick = () => {
    if (amount.getValue("number") > 0) setIsConfirmOpen(true);

    return;
  };

  const isActionDisabled = useMemo(
    () => (isDeposit ? !depositAvailability : !withdrawalAvailability),
    [depositAvailability, withdrawalAvailability, isDeposit],
  );

  return (
    <Box col className="w-full max-w-[880px] flex self-center gap-3 mt-2">
      <div className="grid grid-cols-2 gap-4">
        {stats.map((item) => (
          <Card className="!rounded-2xl p-4 flex flex-col gap-2" key={item.label}>
            <Text fontSize="20px" variant="primary">
              {item.label}
            </Text>
            <Flex className="flex-row gap-1 my-auto">
              <Text fontSize="14px" variant="secondary">
                {item.value}
              </Text>
              <Tooltip className="my-auto" content={item.tooltip} place="bottom">
                <Icon className="ml-1 my-auto" color="primaryBtn" name="infoCircle" size={18} />
              </Tooltip>
            </Flex>
          </Card>
        ))}
      </div>

      <div className="w-full my-2 border-0 border-b-2 border-solid !border-opacity-25 dark:border-dark-border-primary" />
      <Box className="flex flex-col w-full">
        <InfoTip
          className="m-auto !pt-2 !pb-1 !px-2 w-full items-start"
          content={t("views.runePool.warningContent")}
          contentClassName="py-0"
          title={t("views.runePool.warningTitle")}
          type="warn"
        />
        <Box alignCenter className="mt-4">
          <Text className="ml-3 mr-2" textStyle="h3">
            {t("common.pool")} RUNE
          </Text>
          {/* <Text textStyle="h3" variant="primaryBtn">
            {t('common.apr').toUpperCase()}
          </Text>

          <Tooltip content={t('views.runePool.aprTooltip', { asset: 'RUNE' })} place="bottom">
            <Icon className="ml-1" color="primaryBtn" name="infoCircle" size={24} />
          </Tooltip> */}
        </Box>

        <Box alignCenter className="px-3" justify="between">
          <Text fontWeight="medium" textStyle="caption" variant="secondary">
            {t("views.runePool.description", { asset: "RUNE" })}
            {/* <Link className="text-twitter-blue cursor-pointer" to={SAVERS_MEDIUM}>
              <Text fontWeight="medium" textStyle="caption" variant="blue">
                {`${t('common.learnMore')} →`}
              </Text>
            </Link> */}
          </Text>
        </Box>
      </Box>

      <Box row className="w-full grid grid-cols-2 justify-center gap-5 mt-2">
        <Box col className="self-stretch">
          <HighlightCard className="!rounded-2xl pt-2 !pb-0 !gap-0" type="primary">
            <Box alignCenter className="cursor-pointer" justify="between">
              <Box alignCenter flex={1} justify="between">
                <Box center>
                  <Box col>
                    <AssetIcon asset={AssetValue.from({ asset: "THOR.RUNE" })} size={32} />
                  </Box>

                  <Text
                    className={classNames("mx-1 md:mx-3 !transition-all")}
                    fontWeight="semibold"
                  >
                    {position.asset.ticker}
                  </Text>
                </Box>

                <Flex>
                  <Text fontWeight="bold">
                    {position.value?.toSignificant(8)} {position.asset.ticker}
                  </Text>
                  <Text>&nbsp;</Text>
                  <Text fontWeight="light">{`(${amountUsd(position.value)})`}</Text>
                </Flex>
              </Box>
            </Box>

            <Box className="gap-2">
              <InfoTable horizontalInset className="my-3" items={infoFields} size="sm" />
            </Box>
          </HighlightCard>
        </Box>

        <Box col className={classNames("flex h-full", isLgActive && "w-full")}>
          <Card
            stretch
            className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch space-y-1 shadow-lg md:w-full md:h-auto"
            size="lg"
          >
            <Box col className="self-stretch gap-2">
              <TabsSelect
                onChange={(value) => switchTab(value as RunePoolTab)}
                tabs={tabs}
                value={tab}
              />

              {tab === RunePoolTab.Withdraw && (
                <PercentageSlider
                  onChange={handlePercentWithdrawChange}
                  percent={withdrawPercent}
                  title={t("common.withdrawPercent")}
                />
              )}

              <AssetInput
                noFilters
                singleAsset
                assets={[{ asset: AssetValue.from({ asset: "THOR.RUNE" }) }]}
                className="flex-1"
                disabled={tab === RunePoolTab.Withdraw}
                onAssetChange={() => false}
                onValueChange={setAmount}
                poolAsset={runeAsset}
                selectedAsset={runeAsset}
              />

              {/* <InfoTable horizontalInset items={summary} /> */}

              <Box className="self-stretch pt-5">
                {address ? (
                  <Box className="w-full">
                    <Button
                      stretch
                      disabled={isActionDisabled}
                      error={isActionDisabled}
                      onClick={() => handleDepositButtonClick()}
                      size="lg"
                      tooltipClasses="text-center mx-[-2px]"
                      variant="fancy"
                    >
                      {isDeposit ? t("common.deposit") : t("common.withdraw")}
                    </Button>
                  </Box>
                ) : (
                  <Button
                    stretch
                    onClick={() => setIsConnectModalOpen(true)}
                    size="lg"
                    variant="fancy"
                  >
                    {t("common.connectWallet")}
                  </Button>
                )}
              </Box>
            </Box>
          </Card>

          {isConfirmOpen && (
            <ConfirmModal
              buttonDisabled={!(amount.getValue("number") > 0)}
              inputAssets={[RUNEAsset]}
              isOpened={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => handleDepositSubmit()}
            >
              <Box col className="mb-5 gap-2">
                <Flex className="flex flex-col">
                  {txInfos.map(({ label, value, icon }) => (
                    <InfoRow
                      key={label}
                      label={label}
                      value={
                        <Box center className="gap-1">
                          <Text textStyle="caption">{value}</Text>
                          {icon && <AssetIcon asset={icon} size={22} />}
                        </Box>
                      }
                    />
                  ))}
                </Flex>
                <InfoTip
                  className="m-auto !pt-2 !pb-1 !px-2 w-full"
                  content={t("views.runePool.confirmModalInfoContent")}
                  contentClassName="py-0"
                  title={t("views.runePool.confirmModalInfoTitle")}
                  type="warn"
                />
              </Box>
            </ConfirmModal>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default RunePool;
