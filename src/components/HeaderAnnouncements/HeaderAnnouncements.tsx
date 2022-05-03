import { Announcement } from 'components/Announcement'
import { Box } from 'components/Atomic'
import { useHeaderAnnouncements } from 'components/HeaderAnnouncements/useHeaderAnnouncements'

export const HeaderAnnouncements = () => {
  const announcements = useHeaderAnnouncements()
  return (
    <Box className="pt-3 self-stretch gap-1" col>
      {announcements.map((announcement) => (
        <Announcement
          key={`${announcement.message}${announcement.title}${announcement.type}`}
          announcement={announcement}
        />
      ))}
    </Box>
  )
}
