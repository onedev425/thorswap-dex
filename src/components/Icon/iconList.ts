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
  FaCheck,
} from 'react-icons/fa'
import { FiRefreshCw, FiXCircle, FiChevronDown } from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { MdAreaChart } from 'react-icons/md'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

export type IconName = keyof typeof Icons

const Icons = {
  binance: SiBinance,
  bitcoin: GrBitcoin,
  chartArea2: FaChartArea,
  chartArea: MdAreaChart,
  chartPie: FaChartPie,
  checkmark: FaCheck,
  discord: BsDiscord,
  ethereum: FaEthereum,
  fire: FaFire,
  medium: BsMedium,
  refresh: FiRefreshCw,
  search: BsSearch,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  telegram: BsTelegram,
  twitter: BsTwitter,
  wifi: FaWifi,
  xCircle: FiXCircle,
  chevronDown: FiChevronDown,
  ...SvgIcons,
} as const

export default Icons
