import { Chain } from "@swapkit/sdk";
import hmacSHA512 from "crypto-js/hmac-sha512";
import { chainName } from "helpers/chainName";
import { useMimir } from "hooks/useMimir";
import { StatusType, useNetwork } from "hooks/useNetwork";
import { useCallback, useEffect, useMemo } from "react";
import { t } from "services/i18n";
import { SUPPORTED_CHAINS } from "settings/chain";
import { useApp } from "store/app/hooks";
import { useExternalConfig } from "store/externalConfig/hooks";
import type { AnnouncementItem, ChainStatusAnnouncements } from "store/externalConfig/types";
import { AnnouncementType } from "store/externalConfig/types";

const REFRESH_INTERVAL = 1000 * 50 * 5; //5min
const sortOrder = {
  [AnnouncementType.Error]: 0,
  [AnnouncementType.Warn]: 1,
  [AnnouncementType.Info]: 2,
  [AnnouncementType.Primary]: 3,
};

const getOutboundAnnouncement = ({
  outboundQueue,
  outboundQueueLevel,
}: {
  outboundQueue: number;
  outboundQueueLevel: StatusType;
}) => {
  if (outboundQueueLevel !== StatusType.Busy) return [];

  return [
    {
      key: `${new Date().getTime()}`,
      message: t("components.announcements.outboundQueue", { outboundQueue }),
      type: AnnouncementType.Warn,
    },
  ];
};

export const useAnnouncementsList = () => {
  const {
    announcements: storedAnnouncements,
    isTradingGloballyDisabled,
    refreshExternalConfig,
    isLoaded: isConfigLoaded,
  } = useExternalConfig();
  const { outboundQueue, outboundQueueLevel } = useNetwork();
  const { isChainHalted, isChainPauseLP, isChainTradingHalted, isTradingHalted } = useMimir();

  const announcements = useMemo(
    () =>
      [
        ...storedAnnouncements.manual,
        ...(isTradingGloballyDisabled || isTradingHalted
          ? [
              {
                key: `${new Date().getTime()}`,
                message: isTradingHalted
                  ? t("components.announcements.tradingDisabledMimir")
                  : t("components.announcements.tradingGloballyDisabled"),
                type: AnnouncementType.Error,
              },
            ]
          : [
              ...getOutboundAnnouncement({ outboundQueue, outboundQueueLevel }),
              ...getAnnouncementsByChain({
                pausedChains: isChainHalted,
                pausedTrade: isChainTradingHalted,
                pausedLP: isChainPauseLP,
                chainStatus: storedAnnouncements.chainStatus,
              }),
            ]),
      ].sort(
        (a, b) => sortOrder[a.type as AnnouncementType] - sortOrder[b.type as AnnouncementType],
      ),
    [
      isChainHalted,
      isChainPauseLP,
      isChainTradingHalted,
      isTradingGloballyDisabled,
      outboundQueue,
      outboundQueueLevel,
      storedAnnouncements.chainStatus,
      storedAnnouncements.manual,
    ],
  );

  useEffect(() => {
    refreshExternalConfig();
    setInterval(refreshExternalConfig, REFRESH_INTERVAL);
  }, [refreshExternalConfig]);

  return { announcements, isLoaded: isConfigLoaded };
};

type GetAnnouncementsByChainProps = {
  pausedChains: Record<string, boolean>;
  pausedLP: Record<string, boolean>;
  pausedTrade: Record<string, boolean>;
  chainStatus: ChainStatusAnnouncements;
};

const getChainAnnouncement = ({
  chain,
  pausedChains,
  pausedLP,
  pausedTrade,
  chainStatus,
}: GetAnnouncementsByChainProps & { chain: Chain }) => {
  if (
    isChainPaused(Chain.THORChain, pausedChains, pausedLP, pausedTrade) &&
    chain !== Chain.THORChain
  ) {
    return null;
  }

  if (isChainPaused(chain, pausedChains, pausedLP, pausedTrade)) {
    return {
      message:
        chainStatus[chain]?.message ||
        (chain === Chain.THORChain
          ? t("components.announcements.thorChainHalted")
          : t("components.announcements.chainHalted", { chain: chainName(chain, true) })),
      type: chain === Chain.THORChain ? AnnouncementType.Error : AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    };
  }

  if (pausedLP[chain]) {
    return {
      message:
        chainStatus[chain]?.message || t("components.announcements.chainLPHalted", { chain }),
      type: AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    };
  }

  if (pausedTrade[chain]) {
    return {
      message:
        chainStatus[chain]?.message ||
        t("components.announcements.chainTradeHalted", {
          chain: chainName(chain),
        }),
      type: AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    };
  }
  return null;
};

const getAnnouncementId = (ann: AnnouncementItem) => {
  const annId =
    ann.message +
    (ann.type || "") +
    (ann.link?.name || "") +
    (ann.link?.url || "") +
    (ann.chain || "");

  return hmacSHA512(annId, "announcements").toString().slice(-10);
};

const getAnnouncementsByChain = (props: GetAnnouncementsByChainProps) =>
  SUPPORTED_CHAINS.map((chain) => getChainAnnouncement({ chain, ...props }))
    .map((ann) => ann && { ...ann, key: getAnnouncementId(ann) })
    .filter(Boolean) as AnnouncementItem[];

const isChainPaused = (
  chain: Chain,
  pausedChains: Record<string, boolean>,
  pausedLP: Record<string, boolean>,
  pausedTrade: Record<string, boolean>,
) => {
  return pausedChains[chain] || (pausedLP[chain] && pausedTrade[chain]);
};

export const useDismissedAnnouncements = () => {
  const { setAnnDismissedList, dismissedAnnList } = useApp();

  const dismissAnnouncement = useCallback(
    (id: string) => {
      if (!(id && dismissedAnnList)) {
        return;
      }

      const isDismissed = dismissedAnnList.includes(id);

      if (isDismissed) {
        const newList = dismissedAnnList.filter((key) => key !== id);
        setAnnDismissedList(newList);
      } else {
        setAnnDismissedList([id, ...dismissedAnnList]);
      }
    },
    [setAnnDismissedList, dismissedAnnList],
  );

  const refreshDismissedList = useCallback(
    (allAnnouncements: AnnouncementItem[]) => {
      if (!dismissedAnnList) {
        return;
      }

      const allIds = allAnnouncements.map((ann) => ann.key || "").filter(Boolean);

      const updatedList = dismissedAnnList.filter((id) => allIds.includes(id));
      if (updatedList.length !== dismissedAnnList.length) {
        setAnnDismissedList(updatedList);
      }
    },
    [dismissedAnnList, setAnnDismissedList],
  );

  return { dismissAnnouncement, refreshDismissedList };
};

export const useSeenAnnouncements = () => {
  const { setAnnSeenList, seenAnnList } = useApp();

  const seeAnnouncements = useCallback(
    (ids: string[] | string) => {
      if (!(ids && seenAnnList)) {
        return;
      }
      const parsedSeenAnnList: string[] =
        typeof seenAnnList === "string" ? JSON.parse(seenAnnList) : seenAnnList;

      let filtered: string[] = [];
      if (typeof ids === "string") {
        if (parsedSeenAnnList.includes(ids)) return;
        filtered = [ids];
      } else {
        for (const id of ids) {
          if (!parsedSeenAnnList.includes(id)) {
            filtered.push(id);
          }
        }
      }

      setAnnSeenList([...parsedSeenAnnList, ...filtered]);
    },
    [seenAnnList, setAnnSeenList],
  );

  const refreshSeenList = useCallback(
    (allAnnouncements: AnnouncementItem[]) => {
      if (!seenAnnList) {
        return;
      }

      const allIds = allAnnouncements.map((ann) => ann.key || "").filter(Boolean);

      const updatedList = seenAnnList.filter((id) => allIds.includes(id));
      if (updatedList.length !== seenAnnList.length) {
        setAnnSeenList(updatedList);
      }
    },
    [seenAnnList, setAnnSeenList],
  );

  return { seeAnnouncements, refreshSeenList };
};
