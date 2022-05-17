import axios from 'axios'

import { ExternalConfig, Announcement, AnnouncementType } from './types'

const GOOGLE_API_KEY = 'AIzaSyDeBo5Q_YVC0B5Hqrz8XS8o0n4IX6PW_ik'
const SHEET_ID = '13qyyZnv5tyHse4PUJ4548bJdtGQDJpMVjkLXq1gQRS0'
const SHEET_TAB = 'announcements'

// Api for loading external config. Current version is based on google sheet, can be replaced with any other

export const loadConfig = async (): Promise<ExternalConfig> => {
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
      type: row[2] as AnnouncementType,
    }))

    const isTradingGloballyDisabled = values[0][6] === 'TRUE' // cell 1G

    return { announcements, isTradingGloballyDisabled }
  } catch (e) {
    return { announcements: [], isTradingGloballyDisabled: false }
  }
}
