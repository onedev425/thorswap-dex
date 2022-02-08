import { AiOutlineLineChart, AiOutlineUnlock } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
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
import { RiShareBoxLine } from 'react-icons/ri'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

export type IconName = keyof typeof Icons

const Icons = {
  arrowBack: BiArrowBack,
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
  infoCircle: FiInfo,
  medium: BsMedium,
  menu: CgMenu,
  question: BsQuestion,
  search: BsSearch,
  share: RiShareBoxLine,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  telegram: BsTelegram,
  twitter: BsTwitter,
  unlock: AiOutlineUnlock,
  wifi: FaWifi,
  xCircle: FiXCircle,
  ...SvgIcons,
} as const

export default Icons
