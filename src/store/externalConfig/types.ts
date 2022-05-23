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

export type StatusAnnouncementData = {
  isPaused?: boolean
  isLPPaused?: boolean
  isTradingPaused?: boolean
}

export type Announcement = {
  type?: AnnouncementType
  title?: string
  message: string
  chain?: SupportedChain
  link?: StatusAnnouncementLink
}

export type StatusAnnouncement = Announcement & StatusAnnouncementData

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
