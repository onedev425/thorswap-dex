import { useEffect, useMemo } from 'react'

import {
  SUPPORTED_CHAINS,
  THORChain,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { useExternalConfig } from 'store/externalConfig/hooks'
import { Announcement, AnnouncementType } from 'store/externalConfig/types'

import { useMimir } from 'hooks/useMimir'

import { t } from 'services/i18n'

const REFRESH_INTERVAL = 1000 * 50 * 5 //5min

export const useHeaderAnnouncements = () => {
  const {
    announcements: manualAnnouncements,
    isTradingGloballyDisabled,
    refreshExternalConfig,
  } = useExternalConfig()
  const { isChainHalted, isChainPauseLP, isChainTradingHalted } = useMimir()

  const announcements = useMemo(() => {
    if (isTradingGloballyDisabled) {
      return [
        ...manualAnnouncements,
        {
          message: t('components.announcements.tradingGloballyDisabled'),
          type: AnnouncementType.Error,
        },
      ]
    }

    return [
      ...manualAnnouncements,
      ...getAnnouncemetsByChain(
        isChainHalted,
        isChainTradingHalted,
        isChainPauseLP,
      ),
    ]
  }, [
    isChainHalted,
    isChainPauseLP,
    isChainTradingHalted,
    isTradingGloballyDisabled,
    manualAnnouncements,
  ])

  useEffect(() => {
    refreshExternalConfig()
    setInterval(refreshExternalConfig, REFRESH_INTERVAL)
  }, [refreshExternalConfig])

  return announcements
}

const getChainAnnouncement = (
  chain: SupportedChain,
  pausedChains: Record<string, boolean>,
  pausedLP: Record<string, boolean>,
  pausedTrade: Record<string, boolean>,
) => {
  if (
    isChainPaused(Chain.THORChain, pausedChains, pausedLP, pausedTrade) &&
    chain !== THORChain
  ) {
    return null
  }

  if (isChainPaused(chain, pausedChains, pausedLP, pausedTrade)) {
    return {
      message:
        chain === THORChain
          ? t('components.announcements.thorChainHalted')
          : t('components.announcements.chainHalted', { chain }),
      type:
        chain === THORChain ? AnnouncementType.Error : AnnouncementType.Warn,
      chain,
    }
  }

  if (pausedLP[chain]) {
    return {
      message: t('components.announcements.chainLPHalted', { chain }),
      type: AnnouncementType.Warn,
      chain,
    }
  }

  if (pausedTrade[chain]) {
    return {
      message: t('components.announcements.chainTradeHalted', { chain }),
      type: AnnouncementType.Warn,
      chain,
    }
  }
  return null
}

const getAnnouncemetsByChain = (
  pausedChains: Record<string, boolean>,
  pausedLP: Record<string, boolean>,
  pausedTrade: Record<string, boolean>,
) => {
  return SUPPORTED_CHAINS.map((chain) =>
    getChainAnnouncement(chain, pausedChains, pausedLP, pausedTrade),
  ).filter(Boolean) as Announcement[]
}

const isChainPaused = (
  chain: SupportedChain,
  pausedChains: Record<string, boolean>,
  pausedLP: Record<string, boolean>,
  pausedTrade: Record<string, boolean>,
) => {
  return pausedChains[chain] || (pausedLP[chain] && pausedTrade[chain])
}
