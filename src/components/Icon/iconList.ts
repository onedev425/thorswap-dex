import { AiOutlineLineChart } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import {
  BsDiscord,
  BsMedium,
  BsQuestion,
  BsSearch,
  BsTelegram,
  BsTwitter,
  BsEmojiSmile,
} from 'react-icons/bs'
import { CgMenu, CgArrowsExchangeAltV } from 'react-icons/cg'
import {
  FaChartArea,
  FaChartPie,
  FaCheck,
  FaEthereum,
  FaFire,
  FaSortDown,
  FaSortUp,
  FaWifi,
} from 'react-icons/fa'
import {
  FiArrowDown,
  FiChevronDown,
  FiInfo,
  FiSend,
  FiX,
  FiXCircle,
} from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { HiOutlineCog, HiOutlinePlus } from 'react-icons/hi'
import {
  MdAreaChart,
  MdKeyboardArrowUp,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md'
import { RiShareBoxLine } from 'react-icons/ri'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

export type IconName = keyof typeof Icons

const Icons = {
  arrowBack: BiArrowBack,
  arrowDown: FiArrowDown,
  arrowUp: MdKeyboardArrowUp,
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
  lock: MdOutlineLock,
  medium: BsMedium,
  menu: CgMenu,
  plus: HiOutlinePlus,
  question: BsQuestion,
  search: BsSearch,
  send: FiSend,
  share: RiShareBoxLine,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  telegram: BsTelegram,
  twitter: BsTwitter,
  unlock: MdOutlineLockOpen,
  wifi: FaWifi,
  xCircle: FiXCircle,
  smile: BsEmojiSmile,
  ...SvgIcons,
} as const

export default Icons
