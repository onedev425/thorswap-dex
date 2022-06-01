import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import axios from 'axios'

import {
  Announcement,
  AnnouncementsData,
  AnnouncementType,
  ChainStatusAnnouncements,
} from 'store/externalConfig/types'

const GOOGLE_API_KEY = 'AIzaSyDeBo5Q_YVC0B5Hqrz8XS8o0n4IX6PW_ik'
const SHEET_ID = '13qyyZnv5tyHse4PUJ4548bJdtGQDJpMVjkLXq1gQRS0'
const SHEET_TAB = ':batchGet'
const ranges = '&ranges=announcements&ranges=status'

// Api for loading announcements. Current version is based on google sheet, can be replaced with any other
// In the future we can switch to Db-based storage

export const loadConfig = async (): Promise<AnnouncementsData> => {
  const url =
    'https://sheets.googleapis.com/v4/spreadsheets/' +
    SHEET_ID +
    '/values/' +
    SHEET_TAB +
    '?alt=json&key=' +
    GOOGLE_API_KEY +
    ranges

  try {
    const { data } = await axios.get(url)

    const { valueRanges } = data
    const manualData: string[][] = valueRanges[0].values
    const statusData: string[][] = valueRanges[1].values

    const manual = getManualAnnouncements(manualData)
    const chainStatus = getStatusAnnouncements(statusData)

    return { manual, chainStatus }
  } catch (e) {
    return { manual: [], chainStatus: {} }
  }
}

const getManualAnnouncements = (manualData: string[][]) => {
  const isPublished = (row: string[]) => getBooleanValue(row[3])
  const rows = manualData.slice(1, manualData.length).filter(isPublished)

  const manualArr: Announcement[] = rows.map((row) => {
    const [message, title, type, , linkUrl, linkName] = row

    return {
      message,
      title,
      type: type as AnnouncementType,
      link: { url: linkUrl, name: linkName },
    }
  })

  return manualArr
}

const getStatusAnnouncements = (statusData: string[][]) => {
  const cellsCount = 8

  const hasData = (row: string[]) => {
    return Array.from({ length: cellsCount }, (_, index) => index + 1).some(
      (col) => !!row[col]?.trim?.(),
    )
  }
  const rows = statusData.slice(1, statusData.length).filter(hasData)

  const status: ChainStatusAnnouncements = {}

  rows.forEach((row) => {
    const [
      chain,
      message,
      linkUrl,
      linkName,
      isChainPaused,
      isLPPaused,
      isLPDepositPaused,
      isLPWithdrawalPaused,
      isTradingPaused,
    ] = row

    status[chain as SupportedChain] = {
      chain: chain as SupportedChain,
      message,
      link: { url: linkUrl, name: linkName },
      flags: {
        isChainPaused: getBooleanValue(isChainPaused),
        isLPPaused: getBooleanValue(isLPPaused),
        isLPDepositPaused: getBooleanValue(isLPDepositPaused),
        isLPWithdrawalPaused: getBooleanValue(isLPWithdrawalPaused),
        isTradingPaused: getBooleanValue(isTradingPaused),
      },
    }
  })

  return status
}

const getBooleanValue = (val: string | undefined) => {
  return !!val && val?.toLowerCase() === 'true'
}
