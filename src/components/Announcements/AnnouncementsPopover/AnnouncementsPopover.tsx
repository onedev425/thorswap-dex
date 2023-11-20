import { Text } from '@chakra-ui/react';
import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { useSeenAnnouncements } from 'components/Announcements/hooks';
import { Box, Button, Card, Icon } from 'components/Atomic';
import { Popover } from 'components/Popover';
import { Scrollbar } from 'components/Scrollbar';
import { useAnnouncements } from 'context/announcements/AnnouncementsContext';
import useWindowSize from 'hooks/useWindowSize';
import { t } from 'services/i18n';

export const AnnouncementsPopover = () => {
  const notifications = useAnnouncements();
  const { all, fresh, dismissed, seen } = notifications;
  const { isMdActive } = useWindowSize();
  const { seeAnnouncements } = useSeenAnnouncements();

  const onClose = () => {
    if (all.length === 0) return;
    seeAnnouncements(all.map((ann) => (ann.key ? ann.key : '')));
  };
  const announcementsToShow = [...fresh, ...dismissed];

  const unreadAnnouncementsCount = all.length - seen.length;

  return (
    <Popover
      onClose={onClose}
      trigger={
        <Button
          className="relative !px-2"
          leftIcon={<Icon name="bell" size={isMdActive ? 28 : 22} />}
          tooltip={t('components.announcements.announcements')}
          variant="borderlessTint"
        >
          {unreadAnnouncementsCount > 0 && (
            <Box center className="absolute bg-red rounded-full w-4 h-4 right-3 top-1">
              <Text className="text-white" textStyle="caption-xs">
                {unreadAnnouncementsCount}
              </Text>
            </Box>
          )}
        </Button>
      }
    >
      <div>
        <Card
          className="flex-col px-4 m-1 mt-2 border border-solid border-btn-primary min-w-[97vw] md:min-w-[390px]"
          size="sm"
        >
          <Scrollbar height="480px">
            <Text className="p-2" textStyle="subtitle2">
              {t('components.announcements.announcements')}
            </Text>
            <Box col className="pt-3 self-stretch gap-1 px-0.5">
              {announcementsToShow.length > 0 ? (
                announcementsToShow.map((announcement) => (
                  <Announcement
                    dismissed
                    announcement={announcement}
                    key={`${announcement.message}${announcement.title}${announcement.type}`}
                  />
                ))
              ) : (
                <Text className="p-2 text-center" textStyle="caption">
                  {t('common.allCaughtUp')}
                </Text>
              )}
            </Box>
          </Scrollbar>
        </Card>
      </div>
    </Popover>
  );
};
