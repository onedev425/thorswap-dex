import { Announcement } from 'components/Announcements/Announcement/Announcement'
import { useAnnouncements } from 'components/Announcements/AnnouncementsContext'
import { Box } from 'components/Atomic'

export const HeaderAnnouncements = () => {
  const { fresh } = useAnnouncements()

  return (
    <Box className="pt-3 self-stretch gap-1" col>
      {fresh.map((announcement) => (
        <Announcement
          key={`${announcement.message}${announcement.title}${announcement.type}`}
          announcement={announcement}
        />
      ))}
    </Box>
  )
}
