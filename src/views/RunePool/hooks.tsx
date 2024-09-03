import { Flex, Text } from "@chakra-ui/react";
import { SwapKitApi } from "@swapkit/api";
import { Chain, SwapKitNumber } from "@swapkit/core";
import { AssetValue, BaseDecimal } from "@swapkit/sdk";
import { InfoTable } from "components/InfoTable";
import { useWallet } from "context/wallet/hooks";
import { useMimir } from "hooks/useMimir";
import debounce from "lodash.debounce";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGetLastblockQuery } from "store/midgard/api";
import type { RunePoolPosition } from "views/RunePool/types";

export const fetchRunePoolStats = async () => {
  const data = await SwapKitApi.getRunePoolInfo();

  return {
    pol: {
      runeDeposited: SwapKitNumber.fromBigInt(BigInt(data.pol.rune_deposited), BaseDecimal.THOR),
      runeWithdrawn: SwapKitNumber.fromBigInt(BigInt(data.pol.rune_withdrawn), BaseDecimal.THOR),
      value: SwapKitNumber.fromBigInt(BigInt(data.pol.value), BaseDecimal.THOR),
      pnl: SwapKitNumber.fromBigInt(BigInt(data.pol.pnl), BaseDecimal.THOR),
      currentDeposit: SwapKitNumber.fromBigInt(BigInt(data.pol.current_deposit), BaseDecimal.THOR),
    },
    providers: {
      units: SwapKitNumber.fromBigInt(BigInt(data.providers.units), BaseDecimal.THOR),
      pendingUnits: data.providers.pending_units,
      pendingRune: data.providers.pending_rune,
      value: SwapKitNumber.fromBigInt(BigInt(data.providers.value), BaseDecimal.THOR),
      pnl: SwapKitNumber.fromBigInt(BigInt(data.providers.pnl), BaseDecimal.THOR),
      currentDeposit: SwapKitNumber.fromBigInt(
        BigInt(data.providers.current_deposit),
        BaseDecimal.THOR,
      ),
    },
    reserve: {
      units: SwapKitNumber.fromBigInt(BigInt(data.reserve.units), BaseDecimal.THOR),
      value: SwapKitNumber.fromBigInt(BigInt(data.reserve.value), BaseDecimal.THOR),
      pnl: SwapKitNumber.fromBigInt(BigInt(data.reserve.pnl), BaseDecimal.THOR),
      currentDeposit: SwapKitNumber.fromBigInt(
        BigInt(data.reserve.current_deposit),
        BaseDecimal.THOR,
      ),
    },
  };
};

const fetchRunePoolProviderPosition = async (address: string) => {
  const data = await SwapKitApi.getRunePoolProviderInfo({ thorAddress: address });

  return {
    address,
    asset: AssetValue.from({ asset: "THOR.RUNE" }),
    units: SwapKitNumber.fromBigInt(BigInt(data.units), BaseDecimal.THOR),
    value: SwapKitNumber.fromBigInt(BigInt(data.value), BaseDecimal.THOR),
    pnl: SwapKitNumber.fromBigInt(BigInt(data.pnl), BaseDecimal.THOR),
    depositAmount: SwapKitNumber.fromBigInt(BigInt(data.deposit_amount), BaseDecimal.THOR),
    withdrawAmount: SwapKitNumber.fromBigInt(BigInt(data.withdraw_amount), BaseDecimal.THOR),
    lastDepositHeight: data.last_deposit_height,
    lastWithdrawHeight: data.last_withdraw_height,
  };
};

const EMPTY_POSITION: RunePoolPosition = {
  asset: AssetValue.from({ asset: "THOR.RUNE" }),
  address: "",
  units: new SwapKitNumber({ value: 0, decimal: 8 }),
  value: new SwapKitNumber({ value: 0, decimal: 8 }),
  pnl: new SwapKitNumber({ value: 0, decimal: 8 }),
  depositAmount: new SwapKitNumber({ value: 0, decimal: 8 }),
  withdrawAmount: new SwapKitNumber({ value: 0, decimal: 8 }),
  lastDepositHeight: 0,
  lastWithdrawHeight: 0,
};

type StatsType = {
  label: string;
  value: string;
  tooltip: React.JSX.Element;
};

export const useRunePoolStats = () => {
  const [stats, setStats] = useState<StatsType[]>([]);

  const refreshStats = useCallback(async () => {
    const dataPromise = await debounce(
      async () => {
        return await fetchRunePoolStats();
      },
      1000,
      { leading: true, trailing: false },
    );

    const data = await dataPromise();

    const runePoolItems = [
      {
        label: "Users",
        value: `${data.providers.value.toCurrency("")} RUNE`,
      },
    ];

    const pnlItems = [
      {
        label: "Users",
        value: `${data.providers.pnl.toCurrency("")} RUNE`,
      },
    ];

    const statsList = [
      {
        label: "Total Rune in Pool",
        value: data
          ? `${AssetValue.from({ asset: "THOR.RUNE", value: data.providers.value }).toCurrency(
              "",
            )} RUNE`
          : "-",
        tooltip: (
          <Flex className="flex flex-col">
            <Text fontSize="10px" variant="primary">
              Breakdown of Rune in Pool by source.
            </Text>
            <InfoTable items={runePoolItems} />
          </Flex>
        ),
      },
      {
        label: "Total RUNEPool PnL",
        value: data
          ? `${AssetValue.from({ asset: "THOR.RUNE", value: data.providers.pnl }).toCurrency(
              "",
            )} RUNE`
          : "-",
        tooltip: (
          <Flex className="flex flex-col">
            <Text fontSize="10px" variant="primary">
              Breakdown of RUNEPool PnL by source.
            </Text>
            <InfoTable items={pnlItems} />
          </Flex>
        ),
      },
    ];
    setStats(statsList);
  }, []);
  return {
    stats,
    refreshStats,
  };
};

export const useRunePoolPosition = () => {
  const { wallet, isWalletLoading } = useWallet();
  const [position, setPosition] = useState<RunePoolPosition>(EMPTY_POSITION);

  useEffect(() => {
    if (isWalletLoading) return;

    const thorWallet = wallet[Chain.THORChain];
    if (!thorWallet) {
      setPosition(EMPTY_POSITION);
      return;
    }

    fetchRunePoolProviderPosition(thorWallet.address).then(setPosition);
  }, [wallet, isWalletLoading]);

  return {
    position,
  };
};

export const useRunePoolAvailability = () => {
  const {
    runePoolDepositMaturityBlocks,
    runePoolMaxReserveBackstop,
    isRunePoolHalted,
    polMaxNetworkDeposit,
  } = useMimir();

  const { data } = useGetLastblockQuery();
  const { position } = useRunePoolPosition();
  const [availability, setAvailability] = useState<{
    depositAvailability: boolean;
    withdrawalAvailability: boolean;
  }>({
    depositAvailability: false,
    withdrawalAvailability: false,
  });

  const lastBlock = useMemo(() => data?.[0]?.thorchain, [data]);

  const refreshAvailability = useCallback(async () => {
    const runePoolStats = await fetchRunePoolStats();

    const depositAvailability = true;
    let withdrawalAvailability = true;

    if (isRunePoolHalted) {
      setAvailability({
        depositAvailability: false,
        withdrawalAvailability: false,
      });
      return;
    }

    const hasPositionMatured =
      (position?.lastDepositHeight ?? 0) + runePoolDepositMaturityBlocks <= lastBlock;

    withdrawalAvailability = hasPositionMatured;

    if (runePoolStats.reserve.value.gte(runePoolMaxReserveBackstop.add(polMaxNetworkDeposit))) {
      withdrawalAvailability = false;
    }

    setAvailability({
      depositAvailability,
      withdrawalAvailability,
    });
  }, [
    isRunePoolHalted,
    lastBlock,
    polMaxNetworkDeposit,
    position?.lastDepositHeight,
    runePoolDepositMaturityBlocks,
    runePoolMaxReserveBackstop,
  ]);

  return {
    availability,
    refreshAvailability,
  };
};
