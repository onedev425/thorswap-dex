import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { useAnnouncements } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';

export const HeaderAnnouncements = () => {
  const { fresh } = useAnnouncements();

  return (
    <Box col className="pt-3 self-stretch gap-1">
      {fresh.map((announcement) => (
        <Announcement
          announcement={announcement}
          key={`${announcement.message}${announcement.title}${announcement.type}`}
        />
      ))}
    </Box>
  );
};
