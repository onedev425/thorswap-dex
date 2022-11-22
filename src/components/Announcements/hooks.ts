import { Chain, SUPPORTED_CHAINS, SupportedChain } from '@thorswap-lib/types';
import { getAnnouncementId } from 'components/Announcements/utils';
import { chainName } from 'helpers/chainName';
import { useMimir } from 'hooks/useMimir';
import { StatusType, useNetwork } from 'hooks/useNetwork';
import { useCallback, useEffect, useMemo } from 'react';
import { t } from 'services/i18n';
import { useApp } from 'store/app/hooks';
import { useExternalConfig } from 'store/externalConfig/hooks';
import {
  AnnouncementItem,
  AnnouncementType,
  ChainStatusAnnouncements,
} from 'store/externalConfig/types';
import { useWallet } from 'store/wallet/hooks';

const REFRESH_INTERVAL = 1000 * 50 * 5; //5min

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
      message: t('components.announcements.outboundQueue', { outboundQueue }),
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
  const {
    isChainHalted,
    isChainPauseLP,
    isChainTradingHalted,
    isLoaded: isMimirLoaded,
  } = useMimir();

  const { wallet } = useWallet();

  const oldRuneAvailableAnn = useMemo(() => {
    if (!wallet) return [];
    const ethBalances = wallet.ETH?.balance || [];
    const bnbBalances = wallet.BNB?.balance || [];
    const bothChainBalances = [...ethBalances, ...bnbBalances];
    for (let assetAmount of bothChainBalances) {
      const { asset } = assetAmount;
      if (
        asset.ticker === 'RUNE' &&
        (asset.chain === Chain.Binance || asset.chain === Chain.Ethereum)
      ) {
        return [
          {
            key: `${new Date().getTime()}-old-rune`,
            message: t('components.announcements.oldRune'),
            type: AnnouncementType.Error,
            link: {
              url: '/upgrade',
              name: 'Upgrade now →',
            },
          },
        ];
      }
    }
    return [];
  }, [wallet]);

  const announcements = useMemo(
    () => [
      ...storedAnnouncements.manual,
      ...oldRuneAvailableAnn,
      ...(isTradingGloballyDisabled
        ? [
            {
              key: `${new Date().getTime()}`,
              message: t('components.announcements.tradingGloballyDisabled'),
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
    ],
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

  return { announcements, isLoaded: isMimirLoaded && isConfigLoaded };
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
}: GetAnnouncementsByChainProps & { chain: SupportedChain }) => {
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
          ? t('components.announcements.thorChainHalted')
          : t('components.announcements.chainHalted', { chain })),
      type: chain === Chain.THORChain ? AnnouncementType.Error : AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    };
  }

  if (pausedLP[chain]) {
    return {
      message:
        chainStatus[chain]?.message || t('components.announcements.chainLPHalted', { chain }),
      type: AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    };
  }

  if (pausedTrade[chain]) {
    return {
      message:
        chainStatus[chain]?.message ||
        t('components.announcements.chainTradeHalted', {
          chain: chainName(chain),
        }),
      type: AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    };
  }
  return null;
};

const getAnnouncementsByChain = (props: GetAnnouncementsByChainProps) =>
  SUPPORTED_CHAINS.map((chain) =>
    getChainAnnouncement({
      chain,
      ...props,
    }),
  )
    .map((ann) => ann && { ...ann, key: getAnnouncementId(ann) })
    .filter(Boolean) as AnnouncementItem[];

const isChainPaused = (
  chain: SupportedChain,
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
      if (!id || !dismissedAnnList) {
        return;
      }

      const isDismissed = dismissedAnnList.includes(id);

      if (!isDismissed) {
        setAnnDismissedList([id, ...dismissedAnnList]);
      } else {
        const newList = dismissedAnnList.filter((key) => key !== id);
        setAnnDismissedList(newList);
      }
    },
    [setAnnDismissedList, dismissedAnnList],
  );

  const refreshDismissedList = useCallback(
    (allAnnouncements: AnnouncementItem[]) => {
      if (!dismissedAnnList) {
        return;
      }

      const allIds = allAnnouncements.map((ann) => ann.key || '').filter(Boolean);

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
      if (!ids || !seenAnnList) {
        return;
      }
      const parsedSeenAnnList: string[] =
        typeof seenAnnList === 'string' ? JSON.parse(seenAnnList) : seenAnnList;

      let filtered: string[] = [];
      if (typeof ids === 'string') {
        if (parsedSeenAnnList.includes(ids)) return;
        filtered = [ids];
      } else {
        ids.forEach((annId) => {
          if (!parsedSeenAnnList.includes(annId)) {
            filtered.push(annId);
          }
        });
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

      const allIds = allAnnouncements.map((ann) => ann.key || '').filter(Boolean);

      const updatedList = seenAnnList.filter((id) => allIds.includes(id));
      if (updatedList.length !== seenAnnList.length) {
        setAnnSeenList(updatedList);
      }
    },
    [seenAnnList, setAnnSeenList],
  );

  return { seeAnnouncements, refreshSeenList };
};
