import { Text } from "@chakra-ui/react";
import { BaseDecimal, Chain, SwapKitNumber, TransactionType } from "@swapkit/sdk";
import { Box, Button } from "components/Atomic";
import { HoverIcon } from "components/HoverIcon";
import { InfoRow } from "components/InfoRow";
import { InputAmount } from "components/InputAmount";
import { PanelView } from "components/PanelView";
import { PercentSelect } from "components/PercentSelect/PercentSelect";
import { TabsSelect } from "components/TabsSelect";
import { showErrorToast } from "components/Toast";
import { ViewHeader } from "components/ViewHeader";
import { defaultVestingInfo, useWalletContext } from "context/wallet/WalletProvider";
import { useWallet, useWalletConnectModal } from "context/wallet/hooks";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContractType, contractConfig, triggerContractCall } from "services/contract";
import { t } from "services/i18n";
import { logException } from "services/logger";
import { useAppDispatch } from "store/store";
import { addTransaction, completeTransaction, updateTransaction } from "store/transactions/slice";
import { v4 } from "uuid";

import { VestingType } from "./types";

const Vesting = () => {
  const [amount, setAmount] = useState(new SwapKitNumber({ value: 0, decimal: BaseDecimal.ETH }));
  const [isLoading, setIsLoading] = useState(false);
  const [vestingTab, setVestingTab] = useState(VestingType.THOR);
  const appDispatch = useAppDispatch();
  const [{ vthorVesting, thorVesting }, walletDispatch] = useWalletContext();
  const { getWalletAddress } = useWallet();
  const { setIsConnectModalOpen } = useWalletConnectModal();

  const ethAddress = useMemo(() => getWalletAddress(Chain.Ethereum), [getWalletAddress]);

  const getContractVestingInfo = useCallback(
    async (vestingType: VestingType) => {
      if (!ethAddress) return defaultVestingInfo;

      const { getWallet } = await (await import("services/swapKit")).getSwapKitClient();
      const { getProvider } = await import("@swapkit/toolbox-evm");
      const contractType = vestingType === VestingType.THOR ? "vesting" : "vthor_vesting";
      const { abi, address } = contractConfig[contractType];
      const callParams = {
        callProvider: getProvider(Chain.Ethereum),
        from: ethAddress,
        funcParams: [ethAddress, {}],
      };

      const [
        totalVestedAmount,
        totalClaimedAmount,
        startTime,
        vestingPeriod,
        cliff,
        initialRelease,
      ] =
        (await getWallet(Chain.Ethereum)?.call({
          ...callParams,
          abi,
          contractAddress: address,
          funcName: "vestingSchedule",
        })) || ([] as Todo);

      const claimableAmount = (await getWallet(Chain.Ethereum)?.call({
        ...callParams,
        abi,
        contractAddress: address,
        funcName: "claimableAmount",
      })) as bigint;

      const totalVested = new SwapKitNumber({
        value: totalVestedAmount?.toString() || "0",
        decimal: BaseDecimal.ETH,
      }).div(10 ** BaseDecimal.ETH);
      const totalClaimed = new SwapKitNumber({
        value: totalClaimedAmount?.toString() || "0",
        decimal: BaseDecimal.ETH,
      }).div(10 ** BaseDecimal.ETH);
      const claimable = new SwapKitNumber({
        value: claimableAmount?.toString() || "0",
        decimal: BaseDecimal.ETH,
      }).div(10 ** BaseDecimal.ETH);
      const hasAlloc = totalVested.gt(0) || totalClaimed.gt(0) || claimable.gt(0);

      return {
        totalVestedAmount: totalVested.getValue("string"),
        totalClaimedAmount: totalClaimed,
        startTime: dayjs.unix(startTime.toString()).format("YYYY-MM-DD HH:MM:ss"),
        vestingPeriod: dayjs.duration(vestingPeriod.toString() * 1000).asDays() / 365,
        cliff: dayjs.duration(cliff.toString() * 1000).asDays() / 30,
        initialRelease: (initialRelease || "0").toString(),
        claimableAmount: claimable,
        hasAlloc,
      };
    },
    [ethAddress],
  );

  const handleClaim = useCallback(
    async ({ vestingAction, amount }: { vestingAction: VestingType; amount: SwapKitNumber }) => {
      if (amount.lte(0)) return;

      setIsLoading(true);
      const id = v4();

      try {
        appDispatch(
          addTransaction({
            id,
            inChain: Chain.Ethereum,
            type: TransactionType.ETH_STATUS,
            label: `${t("txManager.claim")} ${amount.toSignificant(8)} ${vestingAction}`,
          }),
        );

        const txHash = (await triggerContractCall(
          vestingAction === VestingType.THOR ? ContractType.VESTING : ContractType.VTHOR_VESTING,
          "claim",
          [amount.getBaseValue("bigint")],
        )) as string;

        if (txHash) {
          appDispatch(updateTransaction({ id, txid: txHash }));
        }
      } catch (error) {
        logException(error as Error);
        appDispatch(completeTransaction({ id, status: "error" }));

        showErrorToast(
          t("notification.submitFail"),
          t("common.defaultErrMsg"),
          undefined,
          error as Error,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [appDispatch],
  );

  const loadVestingInfo = useCallback(async () => {
    if (!ethAddress || isLoading) return;
    setIsLoading(true);

    try {
      const thorVestingInfo = await getContractVestingInfo(VestingType.THOR);
      const vthorVestingInfo = await getContractVestingInfo(VestingType.VTHOR);
      walletDispatch({ type: "setTHORVesting", payload: thorVestingInfo });
      walletDispatch({ type: "setVTHORVesting", payload: vthorVestingInfo });
    } catch (error) {
      logException((error as Todo).toString());
    } finally {
      setIsLoading(false);
    }
  }, [ethAddress, getContractVestingInfo, isLoading, walletDispatch]);

  useEffect(() => {
    loadVestingInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    vestingPeriod,
    totalClaimedAmount,
    totalVestedAmount,
    startTime,
    claimableAmount,
    cliff,
  } = useMemo(
    () => (vestingTab === VestingType.THOR ? thorVesting : vthorVesting),
    [thorVesting, vthorVesting, vestingTab],
  );

  const handleChangeTokenAmount = useCallback(
    (amount: SwapKitNumber) => {
      setAmount(amount.gt(claimableAmount) ? claimableAmount : amount);
    },
    [claimableAmount],
  );

  const handleChangePercent = useCallback(
    (percent: number) => {
      setAmount(
        new SwapKitNumber({
          value: claimableAmount.mul(percent).div(100).getValue("string"),
          decimal: BaseDecimal.ETH,
        }),
      );
    },
    [claimableAmount],
  );

  return (
    <PanelView
      header={
        <ViewHeader
          actionsComponent={
            ethAddress && (
              <HoverIcon iconName="refresh" onClick={loadVestingInfo} size={18} spin={isLoading} />
            )
          }
          title={t("views.vesting.vesting")}
        />
      }
      title={t("views.vesting.vesting")}
    >
      <Box className="self-stretch">
        <TabsSelect
          onChange={(v) => setVestingTab(v as VestingType)}
          tabs={[
            { label: t("views.vesting.vestingThor"), value: VestingType.THOR },
            {
              label: t("views.vesting.vestingVthor"),
              value: VestingType.VTHOR,
            },
          ]}
          value={vestingTab}
        />
      </Box>
      <Box col className="w-full p-2 pt-0">
        <InfoRow label={t("views.vesting.totalVested")} value={totalVestedAmount} />
        <InfoRow
          label={t("views.vesting.totalClaimed")}
          value={totalClaimedAmount.toSignificant(10)}
        />
        <InfoRow
          label={t("views.vesting.vestingStartTime")}
          value={totalVestedAmount === "0" ? "N/A" : startTime}
        />
        <InfoRow
          label={t("views.vesting.cliff")}
          value={t("views.vesting.cliffValue", { cliff })}
        />
        <InfoRow
          label={t("views.vesting.vestingPeriod")}
          value={t("views.vesting.vestingPeriodValue", { vestingPeriod })}
        />
        <InfoRow
          label={t("views.vesting.claimableAmount")}
          value={claimableAmount.toSignificant(10)}
        />

        {ethAddress && (
          <>
            <Box alignCenter row className="!mt-6" justify="between">
              <Text className="pr-4 min-w-fit">{t("views.vesting.claimAmount")}</Text>

              <InputAmount
                stretch
                amountValue={amount}
                border="rounded"
                className="!text-right !text-base"
                onAmountChange={handleChangeTokenAmount}
              />
            </Box>
            <Box className="!mt-4 flex-1">
              <PercentSelect onSelect={handleChangePercent} options={[25, 50, 75, 100]} />
            </Box>
          </>
        )}

        {ethAddress ? (
          <Button
            stretch
            className="mt-4"
            loading={isLoading}
            onClick={() => handleClaim({ vestingAction: vestingTab, amount })}
            size="lg"
            variant="fancy"
          >
            {t("views.vesting.claim")}
          </Button>
        ) : (
          <Button
            stretch
            className="mt-4"
            onClick={() => setIsConnectModalOpen(true)}
            size="lg"
            variant="fancy"
          >
            {t("common.connectWallet")}
          </Button>
        )}
      </Box>
    </PanelView>
  );
};

export default Vesting;
