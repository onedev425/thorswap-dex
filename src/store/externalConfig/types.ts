import { SupportedChain } from '@thorswap-lib/multichain-sdk'

export enum AnnouncementType {
  Primary = 'primary',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export type StatusAnnouncementLink = {
  name?: string
  url: string
}

export enum ChainStatusFlag {
  isChainPaused = 'isChainPaused',
  isLPPaused = 'isLPPaused',
  isLPDepositPaused = 'isLPDepositPaused',
  isLPWithdrawalPaused = 'isLPWithdrawalPaused',
  isTradingPaused = 'isTradingPaused',
}

export type ChainStatusFlags = Partial<Record<ChainStatusFlag, boolean>>

export type Announcement = {
  type?: AnnouncementType
  title?: string
  message: string
  chain?: SupportedChain
  link?: StatusAnnouncementLink
}

export type StatusAnnouncement = Announcement & {
  flags?: ChainStatusFlags
}

export type ChainStatusAnnouncements = Partial<
  Record<SupportedChain, StatusAnnouncement>
>

export type AnnouncementsData = {
  manual: Announcement[]
  chainStatus: ChainStatusAnnouncements
}

export type ExternalConfig = {
  announcements: AnnouncementsData
  isTradingGloballyDisabled: boolean
}

export type State = ExternalConfig
