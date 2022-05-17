import { useEffect, useMemo } from 'react'

import { THORChain } from '@thorswap-lib/multichain-sdk'

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
      ...getHaltedChainAnnouncements(isChainHalted),
      ...getHaltedTradeAnnouncements(isChainTradingHalted, isChainHalted),
      ...getHaltedLPAnnouncements(isChainPauseLP, isChainHalted),
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

const getHaltedChainAnnouncements = (
  pausedData: Record<string, boolean>,
): Announcement[] => {
  if (pausedData[THORChain]) {
    return [
      {
        message: t('components.announcements.thorChainHalted'),
        type: AnnouncementType.Error,
      },
    ]
  }

  const chains = getPausedChains(pausedData)

  return chains.map((chain) => ({
    message: t('components.announcements.chainHalted', { chain }),
    type: AnnouncementType.Warn,
  }))
}

const getHaltedLPAnnouncements = (
  pausedData: Record<string, boolean>,
  chainPausedData: Record<string, boolean>,
): Announcement[] => {
  if (chainPausedData[THORChain]) {
    return []
  }

  const chains = getPausedChains(pausedData).filter((c) => !chainPausedData[c])

  return chains.map((chain) => ({
    message: t('components.announcements.chainLPHalted', { chain }),
    type: AnnouncementType.Warn,
  }))
}

const getHaltedTradeAnnouncements = (
  pausedData: Record<string, boolean>,
  chainPausedData: Record<string, boolean>,
): Announcement[] => {
  if (chainPausedData[THORChain]) {
    return []
  }

  const chains = getPausedChains(pausedData).filter((c) => !chainPausedData[c])

  return chains.map((chain) => ({
    message: t('components.announcements.chainTradeHalted', { chain }),
    type: AnnouncementType.Warn,
  }))
}

const getPausedChains = (data: Record<string, boolean>) => {
  const items: string[] = []

  Object.entries(data).forEach(([chain, isPaused]) => {
    if (isPaused) {
      items.push(chain)
    }
  })

  return items
}
