import { Announcement } from 'components/Announcements/Announcement/Announcement'
import { useAnnouncements } from 'components/Announcements/AnnouncementsContext'
import { useSeenAnnouncements } from 'components/Announcements/hooks'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'
import { Scrollbar } from 'components/Scrollbar'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

export const AnnouncementsPopover = () => {
  const notifications = useAnnouncements()
  const { all, fresh, dismissed, seen } = notifications
  const { isMdActive } = useWindowSize()
  const { seeAnnouncements } = useSeenAnnouncements()

  const onClose = () => {
    if (all.length === 0) return
    seeAnnouncements(all.map((ann) => (ann.key ? ann.key : '')))
  }
  const announcementsToShow = [...fresh, ...dismissed]

  return (
    <Popover
      onClose={onClose}
      trigger={
        <Button
          className="relative !px-2"
          type="borderless"
          variant="tint"
          startIcon={<Icon name="bell" size={isMdActive ? 28 : 22} />}
          tooltip={t('components.announcements.announcements')}
        >
          {all.length - seen.length > 0 && (
            <Box
              center
              className="absolute bg-red rounded-full w-4 h-4 right-3 top-1"
            >
              {all.length - seen.length}
            </Box>
          )}
        </Button>
      }
    >
      <div>
        <Card
          size="sm"
          className="flex-col px-4 m-1 mt-2 border border-solid border-btn-primary min-w-[97vw] md:min-w-[390px]"
        >
          <Scrollbar height="480px">
            <Typography className="p-2" variant="subtitle2">
              {t('components.announcements.announcements')}
            </Typography>
            <Box className="pt-3 self-stretch gap-1" col>
              {announcementsToShow.length > 0 ? (
                announcementsToShow.map((announcement) => (
                  <Announcement
                    key={`${announcement.message}${announcement.title}${announcement.type}`}
                    announcement={announcement}
                    dismissed
                  />
                ))
              ) : (
                <Typography className="p-2 text-center" variant="caption">
                  {t('common.allCaughtUp')}
                </Typography>
              )}
            </Box>
          </Scrollbar>
        </Card>
      </div>
    </Popover>
  )
}
