import { FeeOption } from '@thorswap-lib/xchain-client'

import { SupportedLanguages, ThemeType } from 'types/global'

export interface State {
  themeType: ThemeType
  baseCurrency: string
  isSettingOpen: boolean
  isAnnOpen: boolean
  language: SupportedLanguages
  // for only mobile version (not desktop version)
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  slippageTolerance: number
  feeOptionType: FeeOption
  showAnnouncement: boolean
  expertMode: ExpertOptions
  nodeWatchList: string[]
}

export enum ExpertOptions {
  'on' = 'on',
  'off' = 'off',
}
