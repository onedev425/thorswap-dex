import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { useDismissedAnnouncements, useSeenAnnouncements } from 'components/Announcements/hooks';
import { ChainIcon } from 'components/AssetIcon/ChainIcon';
import { Box, Link } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { HoverIcon } from 'components/HoverIcon';
import type { ReactNode } from 'react';
import { memo } from 'react';
import { t } from 'services/i18n';
import type { AnnouncementItem } from 'store/externalConfig/types';
import { AnnouncementType } from 'store/externalConfig/types';

type AnnouncementProps = {
  onClick?: () => void;
  showClose?: boolean;
  size?: 'sm' | 'md';
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
    size = 'md',
    showClose = true,
    announcement: { type = AnnouncementType.Primary, message, title, chain, link, key },
    rightComponent,
    dismissed,
    onClick,
  }: AnnouncementProps) => {
    const { dismissAnnouncement } = useDismissedAnnouncements();
    const { seeAnnouncements } = useSeenAnnouncements();
    const isSmall = size === 'sm';

    if (!message && !title) {
      return null;
    }

    return (
      <Box
        center
        className={classNames(
          'rounded-2xl',
          genericBgClasses.primary,
          isSmall ? 'py-1 px-4' : 'px-12 py-3 relative',
          { 'cursor-pointer': onClick },
          { '!px-4': dismissed && !chain },
          { '!pr-4': dismissed && chain },
        )}
        onClick={onClick}
      >
        {chain && (
          <Box className="absolute left-4 h-full items-center">
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

          {typeof message === 'string' ? (
            <Text textStyle={dismissed || isSmall ? 'caption-xs' : 'body'}>
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
          ) : (
            message
          )}
        </Box>

        {!dismissed && showClose && (
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
