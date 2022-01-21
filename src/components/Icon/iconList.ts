import { BsDiscord, BsMedium, BsTelegram, BsTwitter } from 'react-icons/bs'
import { FaChartPie, FaWifi, FaChartArea } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import { IconType } from 'react-icons/lib'
import { MdAreaChart } from 'react-icons/md'

import { ChartCandle } from './custom/ChartCandle'

export type IconName =
  | 'discord'
  | 'medium'
  | 'telegram'
  | 'twitter'
  | 'chartPie'
  | 'chartArea'
  | 'chartArea2'
  | 'chartCandle'
  | 'refresh'
  | 'wifi'

const Icons: Record<IconName, IconType> = {
  discord: BsDiscord,
  medium: BsMedium,
  telegram: BsTelegram,
  twitter: BsTwitter,
  chartPie: FaChartPie,
  chartArea: MdAreaChart,
  chartArea2: FaChartArea,
  chartCandle: ChartCandle as IconType,
  refresh: FiRefreshCw,
  wifi: FaWifi,
}

export default Icons
