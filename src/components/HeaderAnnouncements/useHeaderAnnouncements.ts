import { useEffect, useMemo, useState } from 'react'

import { THORChain } from '@thorswap-lib/multichain-sdk'
import axios from 'axios'

import { Announcement, AnnouncemetType } from 'components/Announcement/types'

import { useMimir } from 'hooks/useMimir'

import { t } from 'services/i18n'

const GOOGLE_API_KEY = 'AIzaSyDeBo5Q_YVC0B5Hqrz8XS8o0n4IX6PW_ik'
const SHEET_ID = '13qyyZnv5tyHse4PUJ4548bJdtGQDJpMVjkLXq1gQRS0'
const SHEET_TAB = 'announcements'
const REFRESH_INTERVAL = 1000 * 50 * 5 //5min

export const useHeaderAnnouncements = () => {
  const { isChainHalted, isChainPauseLP, isChainTradingHalted } = useMimir()
  const [manualAnnouncements, setManualAnnouncements] = useState<
    Announcement[]
  >([])

  const announcements = useMemo(
    () => [
      ...manualAnnouncements,
      ...getHaltedChainAnnouncements(isChainHalted),
      ...getHaltedTradeAnnouncements(isChainTradingHalted),
      ...getHaltedLPAnnouncements(isChainPauseLP),
    ],
    [isChainHalted, isChainPauseLP, isChainTradingHalted, manualAnnouncements],
  )

  useEffect(() => {
    const refreshAnnouncements = async () => {
      const data = await loadGSheetAnnouncements()
      setManualAnnouncements(data)
    }

    refreshAnnouncements()
    setInterval(refreshAnnouncements, REFRESH_INTERVAL)
  }, [])

  return announcements
}

const getHaltedChainAnnouncements = (
  pausedData: Record<string, boolean>,
): Announcement[] => {
  if (pausedData[THORChain]) {
    return [
      {
        message: t('components.announcements.thorChainHalted'),
        type: AnnouncemetType.Error,
      },
    ]
  }

  const chains = getPausedChains(pausedData)

  return chains.map((chain) => ({
    message: t('components.announcements.chainHalted', { chain }),
    type: AnnouncemetType.Warn,
  }))
}

const getHaltedLPAnnouncements = (
  pausedData: Record<string, boolean>,
): Announcement[] => {
  if (pausedData[THORChain]) {
    return [
      {
        message: t('components.announcements.thorChainLPHalted'),
        type: AnnouncemetType.Error,
      },
    ]
  }

  const chains = getPausedChains(pausedData)

  return chains.map((chain) => ({
    message: t('components.announcements.chainLPHalted', { chain }),
    type: AnnouncemetType.Warn,
  }))
}

const getHaltedTradeAnnouncements = (
  pausedData: Record<string, boolean>,
): Announcement[] => {
  if (pausedData[THORChain]) {
    return [
      {
        message: t('components.announcements.thorChainTradeHalted'),
        type: AnnouncemetType.Error,
      },
    ]
  }

  const chains = getPausedChains(pausedData)

  return chains.map((chain) => ({
    message: t('components.announcements.chainTradeHalted', { chain }),
    type: AnnouncemetType.Warn,
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

const loadGSheetAnnouncements = async () => {
  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/' +
    SHEET_ID +
    '/values/' +
    SHEET_TAB +
    '?alt=json&key=' +
    GOOGLE_API_KEY

  try {
    const { data } = await axios.get(url)
    const { values } = data
    const rows = (values as string[][])
      .slice(1, values.length)
      .filter((row) => row[3] === 'TRUE')

    const announcements: Announcement[] = rows.map((row) => ({
      message: row[0],
      title: row[1],
      type: row[2] as AnnouncemetType,
    }))

    return announcements
  } catch (e) {
    return []
  }
}
