import { ReactNode } from 'react'

import { AnnouncementItem } from 'store/externalConfig/types'

export type AnnouncementProps = {
  announcement: AnnouncementItem
  rightComponent?: ReactNode
  dismissed?: boolean
}
