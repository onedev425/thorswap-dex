import { Announcement } from 'components/Announcements/Announcement/Announcement';
import { useAnnouncements } from 'components/Announcements/AnnouncementsContext';
import { Box } from 'components/Atomic';
import { HorizontalSlider } from 'components/HorizontalSlider';
import useWindowSize from 'hooks/useWindowSize';

export const HeaderAnnouncements = () => {
  const { fresh } = useAnnouncements();
  const { isMdActive, isLgActive } = useWindowSize();

  const showSlider = (!isMdActive && fresh.length > 1) || fresh.length > 2;

  if (showSlider) {
    return (
      <HorizontalSlider showButtons itemWidth={isLgActive ? '94%' : '90%'}>
        {fresh.map((announcement) => (
          <Announcement
            announcement={announcement}
            key={`${announcement.message}${announcement.title}${announcement.type}`}
          />
        ))}
      </HorizontalSlider>
    );
  }

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
