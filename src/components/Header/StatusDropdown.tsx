import { parse } from "url";
import { Text } from "@chakra-ui/react";
import { Box, DropdownMenu } from "components/Atomic";
import { chainName } from "helpers/chainName";
import { useHardCapPercentage } from "hooks/useCheckHardCap";
import { useMimir } from "hooks/useMimir";
import { StatusType, useNetwork } from "hooks/useNetwork";
import { memo, useMemo } from "react";
import { t } from "services/i18n";
import { SUPPORTED_CHAINS } from "settings/chain";
import { MIDGARD_URL, THORNODE_URL } from "settings/config";

import { StatusBadge } from "./StatusBadge";

type StatusItem = {
  label: string;
  value?: string;
  statusType?: StatusType;
};

const getHostnameFromUrl = (u: string): string | null => {
  if (typeof u !== "string") return null;

  const parsed = parse(u, true);
  return parsed?.hostname ?? null;
};

// Midgard IP on devnet OR on test|chaos|mainnet
const midgardUrl = getHostnameFromUrl(MIDGARD_URL) || "";

export const StatusDropdown = memo(() => {
  const { outboundQueue, outboundQueueLevel } = useNetwork();
  const hardCapPercentage = useHardCapPercentage();
  const { isGlobalHalted, isChainTradingHalted, isChainPauseLP, isChainHalted } = useMimir();

  const liquidityCapLabel = useMemo(
    () =>
      hardCapPercentage >= 100
        ? `${t("components.statusDropdown.capLimit")} (${hardCapPercentage.toFixed(2)}%)`
        : `${t("components.statusDropdown.capAvailable")} (${hardCapPercentage.toFixed(2)}%)`,
    [hardCapPercentage],
  );

  const chainsData = useMemo(
    () =>
      SUPPORTED_CHAINS.map((chain) => ({
        label: chainName(chain, true),
        status: isChainHalted[chain]
          ? StatusType.Offline
          : isChainTradingHalted[chain] || isChainPauseLP[chain]
            ? StatusType.Slow
            : StatusType.Good,
      })),
    [isChainHalted, isChainPauseLP, isChainTradingHalted],
  );

  const hardCapStatus = useMemo(
    () => (hardCapPercentage >= 100 ? StatusType.Slow : StatusType.Good),
    [hardCapPercentage],
  );

  const statusType = useMemo(() => {
    if (isGlobalHalted) return StatusType.Offline;

    const chainStatuses = chainsData.map(({ status }) => status);
    if (chainStatuses.includes(StatusType.Offline)) return StatusType.Offline;
    if (outboundQueueLevel !== StatusType.Good) return outboundQueueLevel;
    if (hardCapStatus !== StatusType.Good) return hardCapStatus;

    return chainStatuses.includes(StatusType.Slow) ? StatusType.Slow : StatusType.Good;
  }, [chainsData, hardCapStatus, isGlobalHalted, outboundQueueLevel]);

  const menuItemData: StatusItem[] = useMemo(
    () => [
      {
        label: t("components.statusDropdown.outbound"),
        value: `${t("components.statusDropdown.queue")}: ${outboundQueue} (${outboundQueueLevel})`,
        statusType: statusType,
      },
      {
        label: t("components.statusDropdown.liqCap"),
        value: liquidityCapLabel,
        statusType: hardCapStatus,
      },
      ...chainsData.map(({ label, status }) => ({
        label,
        statusType: status,
        value:
          status === StatusType.Offline
            ? t("components.statusDropdown.offline")
            : t("components.statusDropdown.online"),
      })),
      {
        label: t("components.statusDropdown.midgard"),
        value: midgardUrl,
        statusType: StatusType.Good,
      },
      {
        label: t("components.statusDropdown.thornode"),
        value: getHostnameFromUrl(THORNODE_URL) || "",
        statusType: StatusType.Good,
      },
    ],
    [outboundQueue, outboundQueueLevel, statusType, liquidityCapLabel, hardCapStatus, chainsData],
  );

  const menuItems = useMemo(
    () =>
      menuItemData.map(({ label, value, statusType: type }) => ({
        Component: (
          <Box alignCenter row className="min-w-[200px]">
            <StatusBadge status={type || StatusType.Good} />

            <Box col className="ml-2">
              <Text fontWeight="bold" textStyle="caption" textTransform="uppercase">
                {label}
              </Text>
              <Text
                fontWeight="normal"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant="secondary"
              >
                {value}
              </Text>
            </Box>
          </Box>
        ),
        value: label,
      })),
    [menuItemData],
  );

  return (
    <DropdownMenu
      hideIcon
      menuItems={menuItems}
      onChange={() => undefined}
      openComponent={<StatusBadge status={statusType} />}
      placement="top-end"
      tooltipContent={t("components.statusDropdown.networkStatus")}
      value={t("components.statusDropdown.networkStatus")}
    />
  );
});
