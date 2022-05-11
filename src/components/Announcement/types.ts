import { ReactNode } from 'react'

import { Announcement } from 'store/externalConfig/types'

export type AnnouncementProps = {
  announcement: Announcement
  rightComponent?: ReactNode
}
