import { ReactNode } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'

export enum AnnouncementType {
  Primary = 'primary',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export type Announcement = {
  type?: AnnouncementType
  title?: string
  message: string | ReactNode
  chain?: SupportedChain
}

export type ExternalConfig = {
  announcements: Announcement[]
  isTradingGloballyDisabled: boolean
}

export type State = ExternalConfig
