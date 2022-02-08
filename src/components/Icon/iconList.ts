import { AiOutlineLineChart, AiOutlineUnlock } from 'react-icons/ai'
import {
  BsSearch,
  BsDiscord,
  BsMedium,
  BsTelegram,
  BsTwitter,
  BsQuestion,
} from 'react-icons/bs'
import { CgMenu, CgArrowsExchangeAltV } from 'react-icons/cg'
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
import { HiOutlineCog } from 'react-icons/hi'
import { MdAreaChart } from 'react-icons/md'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

export type IconName = keyof typeof Icons

const Icons = {
  binance: SiBinance,
  bitcoin: GrBitcoin,
  chart: AiOutlineLineChart,
  chartArea2: FaChartArea,
  chartArea: MdAreaChart,
  chartPie: FaChartPie,
  checkmark: FaCheck,
  chevronDown: FiChevronDown,
  close: FiX,
  cog: HiOutlineCog,
  discord: BsDiscord,
  ethereum: FaEthereum,
  exchange: CgArrowsExchangeAltV,
  fire: FaFire,
  info: FiInfo,
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
  question: BsQuestion,
  unlock: AiOutlineUnlock,
  ...SvgIcons,
} as const

export default Icons
