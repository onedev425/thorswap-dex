import { FeeOption } from '@thorswap-lib/xchain-client'

import {
  SupportedLanguages,
  ThemeType,
  ThousandSeparator,
  ViewMode,
} from 'types/app'

export interface State {
  isAnnOpen: boolean
  showAnnouncement: boolean
  isSettingOpen: boolean
  isSidebarCollapsed: boolean
  isSidebarOpen: boolean
  //
  autoRouter: boolean
  baseCurrency: string
  // swap & liquidity options
  expertMode: boolean
  feeOptionType: FeeOption
  slippageTolerance: number
  //
  language: SupportedLanguages
  nodeWatchList: string[]
  themeType: ThemeType
  thousandSeparator: ThousandSeparator
  transactionDeadline: number
  walletViewMode: ViewMode
}
