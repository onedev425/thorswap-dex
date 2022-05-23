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

  const manualArr: Announcement[] = rows.map((row) => ({
    message: row[0],
    title: row[1],
    type: row[2] as AnnouncementType,
    link: { url: row[4], name: row[5] },
  }))

  return manualArr
}

const getStatusAnnouncements = (statusData: string[][]) => {
  const hasData = (row: string[]) => {
    return !!row[1]?.trim() || !!row[2]?.trim()
  }
  const rows = statusData.slice(1, statusData.length).filter(hasData)

  const status: ChainStatusAnnouncements = {}

  rows.forEach((row) => {
    const chain = row[0] as SupportedChain

    status[chain] = {
      chain,
      message: row[1],
      link: { url: row[2], name: row[3] },
    }
  })

  return status
}

const getBooleanValue = (val: string | undefined) => {
  return !!val && val?.toLowerCase() === 'true'
}
