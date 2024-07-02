import { Announcement } from "components/Announcements/Announcement/Announcement";
import { Box } from "components/Atomic";
import { HorizontalSlider } from "components/HorizontalSlider";
import { useAnnouncements } from "context/announcements/AnnouncementsContext";
import useWindowSize from "hooks/useWindowSize";

export const HeaderAnnouncements = () => {
  const { fresh } = useAnnouncements();
  const { isMdActive, isLgActive } = useWindowSize();

  const showSlider = (!isMdActive && fresh.length > 1) || fresh.length > 2;

  if (showSlider) {
    return (
      <HorizontalSlider showButtons itemWidth={isLgActive ? "100%" : "90%"}>
        {fresh.map((announcement) => (
          <Box
            className="!max-w-[90%]"
            key={`${announcement.message}${announcement.title}${announcement.type}`}
          >
            <Announcement announcement={announcement} />
          </Box>
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
