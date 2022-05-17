import classNames from 'classnames'

import { AnnouncementProps } from 'components/Announcement/types'
import { Box, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { AnnouncementType } from 'store/externalConfig/types'

const announcementClasses: Record<AnnouncementType, string> = {
  primary: '!opacity-20 from-transparent via-btn-primary',
  info: 'via-btn-primary',
  warn: 'via-yellow',
  error: 'via-red',
}

const announcementBorderClasses: Record<AnnouncementType, string> = {
  primary: 'border-btn-primary',
  info: 'border-btn-primary',
  warn: 'border-yellow',
  error: 'border-red',
}

export const Announcement = ({
  announcement: { type = AnnouncementType.Primary, message, title },
  rightComponent,
}: AnnouncementProps) => {
  if (!message && !title) {
    return null
  }

  return (
    <Box
      center
      className={classNames(
        'rounded-2xl px-3 md:px-6 py-3.5 relative flex-1',
        genericBgClasses.primary,
      )}
    >
      <Box
        className={classNames(
          'absolute inset-0 bg-gradient-to-r from-transparent to-transparent rounded-2xl opacity-40',
          announcementClasses[type],
        )}
      ></Box>
      <Box
        className={classNames(
          'absolute inset-0 border border-solid rounded-2xl opacity-50',
          announcementBorderClasses[type],
        )}
      ></Box>
      <Box className="z-0" col>
        {title && <Typography variant="subtitle1">{title}</Typography>}
        {message && <Typography>{message}</Typography>}
      </Box>

      {rightComponent ? rightComponent : null}
    </Box>
  )
}
