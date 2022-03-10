import { FeeOption } from '@thorswap-lib/xchain-client'

import { SupportedLanguages, ThemeType, ThousandSeparator } from 'types/global'

export interface State {
  themeType: ThemeType
  baseCurrency: string
  thousandSeparator: ThousandSeparator
  isSettingOpen: boolean
  isAnnOpen: boolean
  language: SupportedLanguages
  // for only mobile version (not desktop version)
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  slippageTolerance: number
  feeOptionType: FeeOption
  showAnnouncement: boolean
  expertMode: boolean
  nodeWatchList: string[]
  autoRouter: boolean
  transactionDeadline: number
}
