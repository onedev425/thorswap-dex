import {
  BsSearch,
  BsDiscord,
  BsMedium,
  BsTelegram,
  BsTwitter,
} from 'react-icons/bs'
import { CgMenu } from 'react-icons/cg'
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
import { FiXCircle, FiChevronDown, FiX, FiInfo } from 'react-icons/fi'
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
  chevronDown: FiChevronDown,
  close: FiX,
  discord: BsDiscord,
  ethereum: FaEthereum,
  fire: FaFire,
  medium: BsMedium,
  search: BsSearch,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  telegram: BsTelegram,
  twitter: BsTwitter,
  wifi: FaWifi,
  xCircle: FiXCircle,
  menu: CgMenu,
  infoCircle: FiInfo,
  ...SvgIcons,
} as const

export default Icons
