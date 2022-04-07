import { FeeOption } from '@thorswap-lib/xchain-client'

import {
  SupportedLanguages,
  ThemeType,
  ThousandSeparator,
  ViewMode,
} from 'types/app'

export interface State {
  // for only mobile version (not desktop version)
  autoRouter: boolean
  baseCurrency: string
  expertMode: boolean
  feeOptionType: FeeOption
  isAnnOpen: boolean
  isSettingOpen: boolean
  isSidebarCollapsed: boolean
  isSidebarOpen: boolean
  language: SupportedLanguages
  nodeWatchList: string[]
  showAnnouncement: boolean
  slippageTolerance: number
  themeType: ThemeType
  thousandSeparator: ThousandSeparator
  transactionDeadline: number
  walletViewMode: ViewMode
}
