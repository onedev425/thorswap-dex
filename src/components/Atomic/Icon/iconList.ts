import {
  AiOutlineLineChart,
  AiOutlineSend,
  AiOutlineSwap,
  AiOutlineQrcode,
} from 'react-icons/ai'
import { BiArrowBack, BiLinkExternal } from 'react-icons/bi'
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
  FaGasPump,
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
  FiPlus,
  FiX,
  FiXCircle,
} from 'react-icons/fi'
import { GrBitcoin } from 'react-icons/gr'
import { HiOutlineCog } from 'react-icons/hi'
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWalletOutline,
} from 'react-icons/io5'
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
import { VscAdd, VscCopy, VscSignOut } from 'react-icons/vsc'

import { SvgIcons } from './svg/svgIconList'

const Icons = {
  add: VscAdd,
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
  copy: VscCopy,
  currencyDollar: BsCurrencyDollar,
  disconnect: VscSignOut,
  discord: BsDiscord,
  ethereum: FaEthereum,
  exchange: CgArrowsExchangeAltV,
  external: BiLinkExternal,
  fire: FaFire,
  gas: FaGasPump,
  info: FiInfo,
  infoCircle: FiInfo,
  invalid: IoCloseCircleOutline,
  language: MdLanguage,
  lock: MdOutlineLock,
  medium: BsMedium,
  menu: CgMenu,
  qrcode: AiOutlineQrcode,
  question: BsQuestion,
  questionCircle: BsQuestionCircle,
  plus: FiPlus,
  search: BsSearch,
  send: AiOutlineSend,
  share: RiShareBoxLine,
  smile: BsEmojiSmile,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  switch: AiOutlineSwap,
  telegram: BsTelegram,
  threeDotsHorizontal: BsThreeDots,
  twitter: BsTwitter,
  unlock: MdOutlineLockOpen,
  valid: IoCheckmarkCircleOutline,
  wallet: IoWalletOutline,
  wifi: FaWifi,
  xCircle: FiXCircle,
  ...SvgIcons,
} as const

export default Icons
