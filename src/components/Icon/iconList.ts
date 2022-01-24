import {
  BsSearch,
  BsDiscord,
  BsMedium,
  BsTelegram,
  BsTwitter,
} from 'react-icons/bs'
import { FaChartPie, FaWifi, FaChartArea, FaEthereum } from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { IconType } from 'react-icons/lib'
import { MdAreaChart } from 'react-icons/md'
import { SiBinance } from 'react-icons/si'

import { ChartCandle } from './custom/ChartCandle'

export type IconName = keyof typeof Icons

const Icons = {
  search: BsSearch,
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
  bitcoin: GrBitcoin,
  ethereum: FaEthereum,
  binance: SiBinance,
} as const

export default Icons
