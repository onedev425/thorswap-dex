import { AiOutlineLineChart } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import {
  BsCurrencyDollar,
  BsDiscord,
  BsEmojiSmile,
  BsMedium,
  BsQuestion,
  BsQuestionCircle,
  BsSearch,
  BsTelegram,
  BsThreeDots,
  BsTwitter,
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
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiInfo,
  FiSend,
  FiX,
  FiXCircle,
} from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { HiOutlineCog, HiOutlinePlus } from 'react-icons/hi'
import {
  MdAreaChart,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowUp,
  MdLanguage,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md'
import { RiShareBoxLine } from 'react-icons/ri'
import { SiBinance } from 'react-icons/si'

import { SvgIcons } from './svg/svgIconList'

const Icons = {
  arrowBack: BiArrowBack,
  arrowDown: FiArrowDown,
  arrowUp: MdKeyboardArrowUp,
  arrowUpLine: MdKeyboardArrowUp,
  arrowDownLine: MdKeyboardArrowDown,
  arrowLeftLine: MdKeyboardArrowLeft,
  arrowRightLine: MdKeyboardArrowRight,
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
  currencyDollar: BsCurrencyDollar,
  discord: BsDiscord,
  ethereum: FaEthereum,
  exchange: CgArrowsExchangeAltV,
  fire: FaFire,
  info: FiInfo,
  infoCircle: FiInfo,
  language: MdLanguage,
  lock: MdOutlineLock,
  medium: BsMedium,
  menu: CgMenu,
  plus: HiOutlinePlus,
  question: BsQuestion,
  questionCircle: BsQuestionCircle,
  search: BsSearch,
  send: FiSend,
  share: RiShareBoxLine,
  smile: BsEmojiSmile,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  telegram: BsTelegram,
  threeDotsHorizontal: BsThreeDots,
  twitter: BsTwitter,
  unlock: MdOutlineLockOpen,
  wifi: FaWifi,
  xCircle: FiXCircle,
  ...SvgIcons,
} as const

export default Icons
