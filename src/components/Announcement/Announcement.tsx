import classNames from 'classnames'

import {
  AnnouncementProps,
  AnnouncemetType,
} from 'components/Announcement/types'
import { Box, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

const announcementClasses: Record<AnnouncemetType, string> = {
  primary: 'opacity-20 from-transparent via-btn-primary',
  info: 'from-btn-primary',
  warn: 'from-yellow',
  error: 'from-red',
}

const announcementBorderClasses: Record<AnnouncemetType, string> = {
  primary: 'border-btn-primary',
  info: 'border-btn-primary',
  warn: 'border-yellow',
  error: 'border-red',
}

export const Announcement = ({
  announcement,
  rightComponent,
}: AnnouncementProps) => {
  const { type = 'primary', message, title } = announcement

  if (!message && !title) {
    return null
  }

  const justifyCenter = !rightComponent && type === 'primary'

  return (
    <Box
      alignCenter
      justifyCenter={justifyCenter}
      justify={justifyCenter ? undefined : 'between'}
      className={classNames(
        'rounded-2xl px-3 md:px-6 py-3.5 relative flex-1',
        genericBgClasses.primary,
      )}
    >
      <Box
        className={classNames(
          'absolute inset-0 bg-gradient-to-r to-transparent rounded-2xl opacity-40',
          announcementClasses[type],
        )}
      ></Box>
      <Box
        className={classNames(
          'absolute inset-0 border border-solid rounded-2xl opacity-50',
          announcementBorderClasses[type],
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
