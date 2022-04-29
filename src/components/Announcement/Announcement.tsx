import classNames from 'classnames'

import {
  AnnouncementProps,
  AnnouncemetType,
} from 'components/Announcement/types'
import { Box, Typography } from 'components/Atomic'

const announcementClasses: Record<AnnouncemetType, string> = {
  primary: '',
  info: 'from-btn-primary border-btn-primary',
  warn: 'from-yellow border-yellow',
  error: 'from-red border-red',
}

export const Announcement = ({
  announcement,
  rightComponent,
}: AnnouncementProps) => {
  const { type = 'primary', message, title } = announcement

  if (!message && !title) {
    return null
  }

  return (
    <Box
      alignCenter
      justify="between"
      className={classNames(
        'rounded-2xl px-3 md:px-6 py-3.5 relative flex-1',
        'bg-light-bg-primary dark:bg-dark-gray-light overflow-hidden',
      )}
    >
      <Box
        className={classNames(
          'absolute inset-0 bg-gradient-to-r to-transparent rounded-2xl opacity-50 border border-solid',
          announcementClasses[type],
        )}
      ></Box>
      <Box className="z-10" col>
        {title && <Typography variant="subtitle1">{title}</Typography>}
        {message && <Typography>{message}</Typography>}
      </Box>
      {rightComponent ? rightComponent : null}
    </Box>
  )
}
