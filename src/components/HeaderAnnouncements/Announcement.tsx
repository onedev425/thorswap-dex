import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Link, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { AnnouncementType } from 'store/externalConfig/types'

import { t } from 'services/i18n'

import { AnnouncementProps } from './types'

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
  announcement,
  rightComponent,
}: AnnouncementProps) => {
  const {
    type = AnnouncementType.Primary,
    message,
    title,
    chain,
    link,
  } = announcement

  if (!message && !title) {
    return null
  }

  return (
    <Box
      center
      className={classNames(
        'rounded-2xl px-12 py-3.5 relative',
        genericBgClasses.primary,
      )}
    >
      {chain && (
        <Box className="absolute left-4">
          <AssetIcon size={26} asset={chainToSigAsset(chain)} />
        </Box>
      )}
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

      <Box className="z-0 text-center" col>
        {!!title && <Typography variant="subtitle1">{title}</Typography>}
        {!!message && (
          <Typography>
            {message}{' '}
            {!!link && link.url && (
              <Link
                className="text-btn-primary hover:underline"
                to={link?.url || ''}
              >
                {link.name || t('common.learnMore')}
              </Link>
            )}
          </Typography>
        )}
      </Box>

      {rightComponent ? rightComponent : null}
    </Box>
  )
}
