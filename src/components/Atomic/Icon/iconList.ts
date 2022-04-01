import {
  AiFillHeart,
  AiFillLock,
  AiFillSignal,
  AiFillStar,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineHeart,
  AiOutlineHistory,
  AiOutlineInfo,
  AiOutlineInfoCircle,
  AiOutlineLineChart,
  AiOutlineUnorderedList,
  AiOutlineMenuFold,
  AiOutlinePercentage,
  AiOutlineQrcode,
  AiOutlineSend,
  AiOutlineStar,
  AiOutlineSwap,
} from 'react-icons/ai'
import {
  BiDollarCircle,
  BiArrowBack,
  BiCopy,
  BiLinkExternal,
  BiSelectMultiple,
  BiUndo,
} from 'react-icons/bi'
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
  BsTrash,
} from 'react-icons/bs'
import { CgMenu, CgArrowsExchangeAltV, CgEye } from 'react-icons/cg'
import {
  FaChartArea,
  FaChartPie,
  FaFire,
  FaGasPump,
  FaSortDown,
  FaSortUp,
  FaWifi,
  FaArrowDown,
} from 'react-icons/fa'
import {
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiPlus,
  FiX,
  FiXCircle,
} from 'react-icons/fi'
import { HiOutlineCog, HiOutlineChartPie } from 'react-icons/hi'
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoWalletOutline,
  IoLanguage,
} from 'react-icons/io5'
import {
  MdAreaChart,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLanguage,
  MdOutlineLockOpen,
  MdSpaceBar,
  MdOutlineHdrAuto,
} from 'react-icons/md'
import { RiShareBoxLine } from 'react-icons/ri'
import {
  VscAdd,
  VscCloudUpload,
  VscKey,
  VscLock,
  VscSignOut,
  VscSymbolMethod,
  VscLoading,
} from 'react-icons/vsc'

import { SvgIcons } from './svg/svgIconList'

const Icons = {
  add: VscAdd,
  arrowBack: BiArrowBack,
  arrowDown: FaArrowDown,
  arrowUp: MdKeyboardArrowUp,
  arrowUpLine: MdKeyboardArrowUp,
  arrowDownLine: MdKeyboardArrowDown,
  arrowLeft: AiOutlineArrowLeft,
  arrowRight: AiOutlineArrowRight,
  auto: MdOutlineHdrAuto,
  backup: VscCloudUpload,
  barchart: AiFillSignal,
  chart: AiOutlineLineChart,
  chartArea2: FaChartArea,
  chartArea: MdAreaChart,
  chartPie: FaChartPie,
  chartPieOutline: HiOutlineChartPie,
  checkmark: FiCheck,
  chevronDown: FiChevronDown,
  chevronLeft: FiChevronLeft,
  chevronRight: FiChevronRight,
  close: FiX,
  cog: HiOutlineCog,
  copy: BiCopy,
  currencyDollar: BsCurrencyDollar,
  disconnect: VscSignOut,
  discord: BsDiscord,
  dollarOutlined: BiDollarCircle,
  edit: FiEdit,
  exchange: CgArrowsExchangeAltV,
  external: BiLinkExternal,
  eye: CgEye,
  fire: FaFire,
  gas: FaGasPump,
  history: AiOutlineHistory,
  info: AiOutlineInfo,
  infoCircle: AiOutlineInfoCircle,
  invalid: IoCloseCircleOutline,
  key: VscKey,
  language: MdLanguage,
  languageLetters: IoLanguage,
  list: AiOutlineUnorderedList,
  loader: VscLoading,
  lock: VscLock,
  lockFill: AiFillLock,
  medium: BsMedium,
  menu: CgMenu,
  menuFold: AiOutlineMenuFold,
  node: VscSymbolMethod,
  percent: AiOutlinePercentage,
  plus: FiPlus,
  qrcode: AiOutlineQrcode,
  question: BsQuestion,
  questionCircle: BsQuestionCircle,
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
  selectAll: BiSelectMultiple,
  spaceBar: MdSpaceBar,
  starFilled: AiFillStar,
  starEmpty: AiOutlineStar,
  heart: AiOutlineHeart,
  heartFilled: AiFillHeart,
  trash: BsTrash,
  revert: BiUndo,
  ...SvgIcons,
} as const

export default Icons
