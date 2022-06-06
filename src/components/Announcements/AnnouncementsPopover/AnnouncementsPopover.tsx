import { Announcement } from 'components/Announcements/Announcement/Announcement'
import { useAnnouncements } from 'components/Announcements/AnnouncementsContext'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'
import { Popover } from 'components/Popover'
import { Scrollbar } from 'components/Scrollbar'

import { t } from 'services/i18n'

export const AnnouncementsPopover = () => {
  const { dismissed: announcements } = useAnnouncements()

  if (!announcements.length) {
    return null
  }

  return (
    <Popover
      trigger={
        <Button
          className="relative !px-2"
          type="borderless"
          variant="tint"
          startIcon={<Icon name="bell" size={28} />}
          tooltip={t('components.announcements.announcements')}
        >
          <Box
            center
            className="absolute bg-red rounded-full w-4 h-4 right-3 top-1"
          >
            {announcements.length}
          </Box>
        </Button>
      }
    >
      <Card
        size="sm"
        className="flex-col px-4 m-1 mt-2 border border-solid border-btn-primary"
      >
        <Scrollbar className="min-w-[380px] max-h-[480px]">
          <Typography className="p-2" variant="subtitle2">
            {t('components.announcements.announcements')}
          </Typography>
          <Box className="pt-3 self-stretch gap-1" col>
            {announcements.map((announcement) => (
              <Announcement
                key={`${announcement.message}${announcement.title}${announcement.type}`}
                announcement={announcement}
                dismissed
              />
            ))}
          </Box>
        </Scrollbar>
      </Card>
    </Popover>
  )
}
