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
  BsThreeDots,
  BsCurrencyDollar,
  BsQuestionCircle,
} from 'react-icons/bs'
import { CgMenu, CgArrowsExchangeAltV } from 'react-icons/cg'
import {
  FaChartArea,
  FaChartPie,
  FaEthereum,
  FaFire,
  FaSortDown,
  FaSortUp,
  FaWifi,
} from 'react-icons/fa'
import {
  FiArrowDown,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiSend,
  FiX,
  FiXCircle,
  FiCheck,
} from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { HiOutlineCog, HiOutlinePlus } from 'react-icons/hi'
import {
  MdAreaChart,
  MdKeyboardArrowUp,
  MdOutlineLock,
  MdOutlineLockOpen,
  MdLanguage,
} from 'react-icons/md'
import { RiShareBoxLine } from 'react-icons/ri'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

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
  checkmark: FiCheck,
  chevronDown: FiChevronDown,
  chevronLeft: FiChevronLeft,
  chevronRight: FiChevronRight,
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
  questionCircle: BsQuestionCircle,
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
  threeDotsHorizontal: BsThreeDots,
  currencyDollar: BsCurrencyDollar,
  language: MdLanguage,
  ...SvgIcons,
} as const

export default Icons
