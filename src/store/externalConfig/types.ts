import { ReactNode } from 'react'

export enum AnnouncemetType {
  Primary = 'primary',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export type Announcement = {
  type?: AnnouncemetType
  title?: string
  message: string | ReactNode
}

export type ExternalConfig = {
  announcements: Announcement[]
  isTradingGloballyDisabled: boolean
}

export type State = ExternalConfig
