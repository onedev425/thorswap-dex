import { useCallback, useEffect, useMemo } from 'react'

import {
  SUPPORTED_CHAINS,
  THORChain,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { getAnnouncementId } from 'components/Announcements/utils'

import { useApp } from 'store/app/hooks'
import { useExternalConfig } from 'store/externalConfig/hooks'
import {
  AnnouncementItem,
  AnnouncementType,
  ChainStatusAnnouncements,
} from 'store/externalConfig/types'

import { useMimir } from 'hooks/useMimir'

import { t } from 'services/i18n'

const REFRESH_INTERVAL = 1000 * 50 * 5 //5min
const DISABLED_CHAINS: Chain[] = [Chain.Terra]

export const useAnouncementsList = () => {
  const {
    announcements: storedAnnouncements,
    isTradingGloballyDisabled,
    refreshExternalConfig,
  } = useExternalConfig()
  const { isChainHalted, isChainPauseLP, isChainTradingHalted } = useMimir()

  const announcements = useMemo(() => {
    if (isTradingGloballyDisabled) {
      return [
        ...storedAnnouncements.manual,
        {
          message: t('components.announcements.tradingGloballyDisabled'),
          type: AnnouncementType.Error,
        },
      ]
    }

    return [
      ...storedAnnouncements.manual,
      ...getAnnouncemetsByChain({
        pausedChains: isChainHalted,
        pausedTrade: isChainTradingHalted,
        pausedLP: isChainPauseLP,
        chainStatus: storedAnnouncements.chainStatus,
      }),
    ]
  }, [
    isChainHalted,
    isChainPauseLP,
    isChainTradingHalted,
    isTradingGloballyDisabled,
    storedAnnouncements.chainStatus,
    storedAnnouncements.manual,
  ])

  useEffect(() => {
    refreshExternalConfig()
    setInterval(refreshExternalConfig, REFRESH_INTERVAL)
  }, [refreshExternalConfig])

  return announcements
}

type GetAnnouncementsByChainProps = {
  pausedChains: Record<string, boolean>
  pausedLP: Record<string, boolean>
  pausedTrade: Record<string, boolean>
  chainStatus: ChainStatusAnnouncements
}

const getChainAnnouncement = ({
  chain,
  pausedChains,
  pausedLP,
  pausedTrade,
  chainStatus,
}: GetAnnouncementsByChainProps & { chain: SupportedChain }) => {
  if (
    isChainPaused(Chain.THORChain, pausedChains, pausedLP, pausedTrade) &&
    chain !== THORChain
  ) {
    return null
  }

  if (isChainPaused(chain, pausedChains, pausedLP, pausedTrade)) {
    return {
      message:
        chainStatus[chain]?.message ||
        (chain === THORChain
          ? t('components.announcements.thorChainHalted')
          : t('components.announcements.chainHalted', { chain })),
      type:
        chain === THORChain ? AnnouncementType.Error : AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    }
  }

  if (pausedLP[chain]) {
    return {
      message:
        chainStatus[chain]?.message ||
        t('components.announcements.chainLPHalted', { chain }),
      type: AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    }
  }

  if (pausedTrade[chain]) {
    return {
      message:
        chainStatus[chain]?.message ||
        t('components.announcements.chainTradeHalted', { chain }),
      type: AnnouncementType.Warn,
      chain,
      link: chainStatus[chain]?.link,
    }
  }
  return null
}

const getAnnouncemetsByChain = (props: GetAnnouncementsByChainProps) => {
  return SUPPORTED_CHAINS.filter((c) => !DISABLED_CHAINS.includes(c))
    .map((chain) =>
      getChainAnnouncement({
        chain,
        ...props,
      }),
    )
    .map((ann) => {
      if (ann) {
        return {
          ...ann,
          key: getAnnouncementId(ann),
        }
      }
    })
    .filter(Boolean) as AnnouncementItem[]
}

const isChainPaused = (
  chain: SupportedChain,
  pausedChains: Record<string, boolean>,
  pausedLP: Record<string, boolean>,
  pausedTrade: Record<string, boolean>,
) => {
  return pausedChains[chain] || (pausedLP[chain] && pausedTrade[chain])
}

export const useDismissedAnnouncements = () => {
  const { setAnnDismissedList, dismissedAnnList } = useApp()

  const dismissAnnouncement = useCallback(
    (id: string) => {
      if (!id || !dismissedAnnList) {
        return
      }

      const isDismissed = dismissedAnnList.includes(id)

      if (!isDismissed) {
        setAnnDismissedList([id, ...dismissedAnnList])
      } else {
        const newList = dismissedAnnList.filter((key) => key !== id)
        setAnnDismissedList(newList)
      }
    },
    [setAnnDismissedList, dismissedAnnList],
  )

  const refreshDismissedList = useCallback(
    (allAnnouncements: AnnouncementItem[]) => {
      if (!dismissedAnnList) {
        return
      }

      const allIds = allAnnouncements
        .map((ann) => ann.key || '')
        .filter(Boolean)

      const updatedList = dismissedAnnList.filter((id) => allIds.includes(id))
      if (updatedList.length !== dismissedAnnList.length) {
        setAnnDismissedList(updatedList)
      }
    },
    [dismissedAnnList, setAnnDismissedList],
  )

  return { dismissAnnouncement, refreshDismissedList }
}

export const useSeenAnnouncements = () => {
  const { setAnnSeenList, seenAnnList } = useApp()

  const seeAnnouncements = useCallback(
    (ids: string[] | string) => {
      if (!ids || !seenAnnList) {
        return
      }
      const parsedSeenAnnList: string[] =
        typeof seenAnnList === 'string' ? JSON.parse(seenAnnList) : seenAnnList

      let filtered: string[] = []
      if (typeof ids === 'string') {
        if (parsedSeenAnnList.includes(ids)) return
        filtered = [ids]
      } else {
        ids.forEach((annId) => {
          if (!parsedSeenAnnList.includes(annId)) {
            filtered.push(annId)
          }
        })
      }

      setAnnSeenList([...parsedSeenAnnList, ...filtered])
    },
    [seenAnnList, setAnnSeenList],
  )

  const refreshSeenList = useCallback(
    (allAnnouncements: AnnouncementItem[]) => {
      if (!seenAnnList) {
        return
      }

      const allIds = allAnnouncements
        .map((ann) => ann.key || '')
        .filter(Boolean)

      const updatedList = seenAnnList.filter((id) => allIds.includes(id))
      if (updatedList.length !== seenAnnList.length) {
        setAnnSeenList(updatedList)
      }
    },
    [seenAnnList, setAnnSeenList],
  )

  return { seeAnnouncements, refreshSeenList }
}
