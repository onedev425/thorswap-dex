import {
  BsSearch,
  BsDiscord,
  BsMedium,
  BsTelegram,
  BsTwitter,
} from 'react-icons/bs'
import {
  FaChartPie,
  FaWifi,
  FaChartArea,
  FaEthereum,
  FaFire,
  FaSortUp,
  FaSortDown,
} from 'react-icons/fa'
import { FiRefreshCw } from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { MdAreaChart } from 'react-icons/md'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

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
  refresh: FiRefreshCw,
  wifi: FaWifi,
  fire: FaFire,
  bitcoin: GrBitcoin,
  ethereum: FaEthereum,
  binance: SiBinance,
  sortUp: FaSortUp,
  sortDown: FaSortDown,
  ...SvgIcons,
} as const

export default Icons
