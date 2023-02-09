import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { useDismissedAnnouncements, useSeenAnnouncements } from 'components/Announcements/hooks';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, Link } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { HoverIcon } from 'components/HoverIcon';
import { memo, ReactNode } from 'react';
import { t } from 'services/i18n';
import { AnnouncementItem, AnnouncementType } from 'store/externalConfig/types';

type AnnouncementProps = {
  announcement: AnnouncementItem;
  rightComponent?: ReactNode;
  dismissed?: boolean;
};

const announcementClasses: Record<AnnouncementType, string> = {
  primary: '!opacity-20 from-transparent via-btn-primary',
  info: 'via-btn-primary',
  warn: 'via-yellow',
  error: 'via-red',
};

const dissmissedAnnouncementClasses: Record<AnnouncementType, string> = {
  primary: '!opacity-20 bg-btn-primary',
  info: 'bg-btn-primary',
  warn: 'bg-yellow',
  error: 'bg-red',
};

const announcementBorderClasses: Record<AnnouncementType, string> = {
  primary: 'border-btn-primary',
  info: 'border-btn-primary',
  warn: 'border-yellow',
  error: 'border-red',
};

export const Announcement = memo(
  ({
    announcement: { type = AnnouncementType.Primary, message, title, chain, link, key },
    rightComponent,
    dismissed,
  }: AnnouncementProps) => {
    const { dismissAnnouncement } = useDismissedAnnouncements();
    const { seeAnnouncements } = useSeenAnnouncements();

    if (!message && !title) {
      return null;
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
            <ChainIcon chain={chain} size={26} />
          </Box>
        )}
        <Box
          className={classNames(
            'absolute inset-0 rounded-2xl opacity-40',
            dismissed ? 'bg-opacity-30' : 'bg-gradient-to-r from-transparent to-transparent',
            dismissed ? dissmissedAnnouncementClasses[type] : announcementClasses[type],
          )}
        />
        <Box
          className={classNames(
            'absolute inset-0 border border-solid rounded-2xl opacity-50',
            announcementBorderClasses[type],
          )}
        />

        <Box col className={classNames('z-0', dismissed ? 'textl-left' : 'text-center')}>
          {!!title && (
            <Text fontWeight="bold" textStyle={dismissed ? 'body' : 'subtitle1'}>
              {title}
            </Text>
          )}

          {!!message && (
            <Text
              fontWeight={dismissed ? 'normal' : undefined}
              textStyle={dismissed ? 'caption' : 'body'}
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
            </Text>
          )}
        </Box>

        {!dismissed && (
          <Box className="absolute right-2 top-2">
            <HoverIcon
              color="secondary"
              iconName="xCircle"
              onClick={() => {
                dismissAnnouncement(key || '');
                seeAnnouncements(key || '');
              }}
              tooltip={t('common.dismiss')}
            />
          </Box>
        )}
        {rightComponent ? rightComponent : null}
      </Box>
    );
  },
);
