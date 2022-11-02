import {
  AiFillHeart,
  AiFillLock,
  AiFillSignal,
  AiFillStar,
  AiOutlineAppstore,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineHeart,
  AiOutlineHistory,
  AiOutlineInfo,
  AiOutlineLineChart,
  AiOutlineMenuFold,
  AiOutlinePercentage,
  AiOutlineQrcode,
  AiOutlineSend,
  AiOutlineStar,
  AiOutlineSwap,
  AiOutlineUnorderedList,
} from 'react-icons/ai';
import {
  BiArrowBack,
  BiBell,
  BiCopy,
  BiDollarCircle,
  BiExport,
  BiImport,
  BiLinkExternal,
  BiPaste,
  BiSelectMultiple,
  BiUndo,
} from 'react-icons/bi';
import {
  BsCurrencyDollar,
  BsDiscord,
  BsEmojiSmile,
  BsExclamationCircle,
  BsMedium,
  BsPersonCheckFill,
  BsPiggyBank,
  BsQuestion,
  BsQuestionCircle,
  BsSearch,
  BsTelegram,
  BsTrash,
  BsTwitter,
  BsYoutube,
} from 'react-icons/bs';
import { CgArrowsExchangeAltV, CgEye, CgMenu } from 'react-icons/cg';
import {
  FaArrowDown,
  FaChartArea,
  FaChartPie,
  FaFire,
  FaGasPump,
  FaRegCommentDots,
  FaSortDown,
  FaSortUp,
  FaWifi,
} from 'react-icons/fa';
import {
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiMinusCircle,
  FiPlus,
  FiPlusCircle,
  FiRefreshCw,
  FiX,
} from 'react-icons/fi';
import { GoBook, GoSettings } from 'react-icons/go';
import { HiOutlineChartPie, HiOutlineCog, HiOutlineDocumentText } from 'react-icons/hi';
import { ImBlocked } from 'react-icons/im';
import {
  IoCart,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoLanguage,
  IoRocketOutline,
  IoWalletOutline,
} from 'react-icons/io5';
import {
  MdAreaChart,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdLanguage,
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineHdrAuto,
  MdOutlineLockOpen,
  MdSpaceBar,
} from 'react-icons/md';
import {
  RiCheckboxMultipleLine,
  RiSave2Fill,
  RiSave2Line,
  RiShareBoxLine,
  RiSurveyLine,
} from 'react-icons/ri';
import { TbPlugConnected } from 'react-icons/tb';
import {
  VscAdd,
  VscCloudUpload,
  VscError,
  VscInfo,
  VscKey,
  VscLoading,
  VscLock,
  VscSignOut,
  VscSymbolMethod,
} from 'react-icons/vsc';

import { SvgIcons } from './svg/svgIconList';

const Icons = {
  add: VscAdd,
  approved: BsPersonCheckFill,
  arrowBack: BiArrowBack,
  arrowDown: FaArrowDown,
  arrowDownLine: MdKeyboardArrowDown,
  arrowLeft: AiOutlineArrowLeft,
  arrowRight: AiOutlineArrowRight,
  arrowUp: MdKeyboardArrowUp,
  arrowUpLine: MdKeyboardArrowUp,
  auto: MdOutlineHdrAuto,
  backup: VscCloudUpload,
  barchart: AiFillSignal,
  bell: BiBell,
  blocked: ImBlocked,
  cart: IoCart,
  chart: AiOutlineLineChart,
  chartArea2: FaChartArea,
  chartArea: MdAreaChart,
  chartPie: FaChartPie,
  chartPieOutline: HiOutlineChartPie,
  checkBoxBlank: MdOutlineCheckBoxOutlineBlank,
  checkBoxChecked: MdOutlineCheckBox,
  checkBoxes: RiCheckboxMultipleLine,
  checkmark: FiCheck,
  chevronDown: FiChevronDown,
  chevronLeft: FiChevronLeft,
  chevronRight: FiChevronRight,
  close: FiX,
  cog: HiOutlineCog,
  connect: TbPlugConnected,
  copy: BiCopy,
  currencyDollar: BsCurrencyDollar,
  disconnect: VscSignOut,
  discord: BsDiscord,
  docs: GoBook,
  documentation: HiOutlineDocumentText,
  dollarOutlined: BiDollarCircle,
  edit: FiEdit,
  exchange: CgArrowsExchangeAltV,
  export: BiExport,
  external: BiLinkExternal,
  eye: CgEye,
  feedback: FaRegCommentDots,
  fire: FaFire,
  gas: FaGasPump,
  grid: AiOutlineAppstore,
  heart: AiOutlineHeart,
  heartFilled: AiFillHeart,
  history: AiOutlineHistory,
  import: BiImport,
  info: AiOutlineInfo,
  infoCircle: VscInfo,
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
  minusCircle: FiMinusCircle,
  multiSettings: GoSettings,
  node: VscSymbolMethod,
  paste: BiPaste,
  percent: AiOutlinePercentage,
  piggyBank: BsPiggyBank,
  plus: FiPlus,
  plusCircle: FiPlusCircle,
  qrcode: AiOutlineQrcode,
  question: BsQuestion,
  questionCircle: BsQuestionCircle,
  refresh: FiRefreshCw,
  revert: BiUndo,
  rocket: IoRocketOutline,
  save: RiSave2Line,
  saveFill: RiSave2Fill,
  search: BsSearch,
  selectAll: BiSelectMultiple,
  send: AiOutlineSend,
  share: RiShareBoxLine,
  smile: BsEmojiSmile,
  sortDown: FaSortDown,
  sortUp: FaSortUp,
  spaceBar: MdSpaceBar,
  starEmpty: AiOutlineStar,
  starFilled: AiFillStar,
  survey: RiSurveyLine,
  switch: AiOutlineSwap,
  telegram: BsTelegram,
  trash: BsTrash,
  twitter: BsTwitter,
  unlock: MdOutlineLockOpen,
  valid: IoCheckmarkCircleOutline,
  wallet: IoWalletOutline,
  warn: BsExclamationCircle,
  wifi: FaWifi,
  xCircle: VscError,
  youtube: BsYoutube,
  ...SvgIcons,
} as const;

export default Icons;
