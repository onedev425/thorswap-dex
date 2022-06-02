import { useEffect, useMemo } from 'react'

import {
  SUPPORTED_CHAINS,
  THORChain,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/xchain-util'

import { useExternalConfig } from 'store/externalConfig/hooks'
import {
  AnnouncementItem,
  AnnouncementType,
  ChainStatusAnnouncements,
} from 'store/externalConfig/types'

import { useMimir } from 'hooks/useMimir'

import { t } from 'services/i18n'

const REFRESH_INTERVAL = 1000 * 50 * 5 //5min

export const useHeaderAnnouncements = () => {
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
  return SUPPORTED_CHAINS.map((chain) =>
    getChainAnnouncement({
      chain,
      ...props,
    }),
  ).filter(Boolean) as AnnouncementItem[]
}

const isChainPaused = (
  chain: SupportedChain,
  pausedChains: Record<string, boolean>,
  pausedLP: Record<string, boolean>,
  pausedTrade: Record<string, boolean>,
) => {
  return pausedChains[chain] || (pausedLP[chain] && pausedTrade[chain])
}
