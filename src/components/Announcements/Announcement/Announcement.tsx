import { memo, ReactNode } from 'react'

import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import {
  useDismissedAnnouncements,
  useSeenAnnouncements,
} from 'components/Announcements/hooks'
import { AssetIcon } from 'components/AssetIcon'
import { Box, Link, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'
import { HoverIcon } from 'components/HoverIcon'

import { AnnouncementItem, AnnouncementType } from 'store/externalConfig/types'

import { t } from 'services/i18n'

type AnnouncementProps = {
  announcement: AnnouncementItem
  rightComponent?: ReactNode
  dismissed?: boolean
}

const announcementClasses: Record<AnnouncementType, string> = {
  primary: '!opacity-20 from-transparent via-btn-primary',
  info: 'via-btn-primary',
  warn: 'via-yellow',
  error: 'via-red',
}

const dissmissedAnnouncementClasses: Record<AnnouncementType, string> = {
  primary: '!opacity-20 bg-btn-primary',
  info: 'bg-btn-primary',
  warn: 'bg-yellow',
  error: 'bg-red',
}

const announcementBorderClasses: Record<AnnouncementType, string> = {
  primary: 'border-btn-primary',
  info: 'border-btn-primary',
  warn: 'border-yellow',
  error: 'border-red',
}

export const Announcement = memo(
  ({
    announcement: {
      type = AnnouncementType.Primary,
      message,
      title,
      chain,
      link,
      key,
    },
    rightComponent,
    dismissed,
  }: AnnouncementProps) => {
    const { dismissAnnouncement } = useDismissedAnnouncements()
    const { seeAnnouncements } = useSeenAnnouncements()

    if (!message && !title) {
      return null
    }

    return (
      <Box
        center
        className={classNames(
          'rounded-2xl px-12 py-3.5 md:w-auto relative',
          genericBgClasses.primary,
          { '!px-4': dismissed && !chain },
          { '!pr-4': dismissed && chain },
        )}
      >
        {chain && (
          <Box className="absolute left-4">
            <AssetIcon size={26} asset={chainToSigAsset(chain)} />
          </Box>
        )}
        <Box
          className={classNames(
            'absolute inset-0 rounded-2xl opacity-40',
            dismissed
              ? 'bg-opacity-30'
              : 'bg-gradient-to-r from-transparent to-transparent',
            dismissed
              ? dissmissedAnnouncementClasses[type]
              : announcementClasses[type],
          )}
        />
        <Box
          className={classNames(
            'absolute inset-0 border border-solid rounded-2xl opacity-50',
            announcementBorderClasses[type],
          )}
        />

        <Box
          className={classNames(
            'z-0',
            dismissed ? 'textl-left' : 'text-center',
          )}
          col
        >
          {!!title && (
            <Typography
              variant={dismissed ? 'body' : 'subtitle1'}
              fontWeight="bold"
            >
              {title}
            </Typography>
          )}

          {!!message && (
            <Typography
              variant={dismissed ? 'caption' : 'body'}
              fontWeight={dismissed ? 'normal' : undefined}
            >
              {`${message} `}
              {!!link?.url && (
                <Link
                  className="text-btn-secondary dark:text-btn-primary hover:underline"
                  to={link.url}
                >
                  {link.name || t('common.learnMore')}
                </Link>
              )}
            </Typography>
          )}
        </Box>

        {!dismissed && (
          <Box className="absolute right-2 top-2">
            <HoverIcon
              iconName="xCircle"
              tooltip={t('common.dismiss')}
              color="secondary"
              onClick={() => {
                dismissAnnouncement(key || '')
                seeAnnouncements(key || '')
              }}
            />
          </Box>
        )}
        {rightComponent ? rightComponent : null}
      </Box>
    )
  },
)
