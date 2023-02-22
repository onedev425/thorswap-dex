import { useAnnouncementsList } from 'components/Announcements/hooks';
import { AnnouncementsState } from 'components/Announcements/types';
import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';
import { useApp } from 'store/app/hooks';

const AnnouncementsContext = createContext<AnnouncementsState>({
  all: [],
  dismissed: [],
  fresh: [],
  seen: [],
});

type Props = {
  children: ReactNode;
};

export const useAnnouncements = () => useContext(AnnouncementsContext);

export const AnnouncementsProvider = ({ children }: Props) => {
  const { announcements: announcementsList, isLoaded } = useAnnouncementsList();
  const { seenAnnList, dismissedAnnList, setAnnDismissedList, setAnnSeenList } = useApp();

  useEffect(() => {
    if (isLoaded) {
      const filteredDismissed = dismissedAnnList.filter((key) =>
        announcementsList.some((ann) => ann.key === key),
      );

      if (filteredDismissed.length !== dismissedAnnList.length) {
        setAnnDismissedList(filteredDismissed);
      }

      const parsedSeenAnnList: string[] =
        typeof seenAnnList === 'string' ? JSON.parse(seenAnnList) : seenAnnList;
      const filteredSeen = parsedSeenAnnList.filter((key) =>
        announcementsList.some((ann) => ann.key === key),
      );

      if (filteredSeen.length !== seenAnnList.length) {
        setAnnSeenList(filteredDismissed);
      }
    }
  }, [
    isLoaded,
    announcementsList,
    dismissedAnnList,
    seenAnnList,
    setAnnDismissedList,
    setAnnSeenList,
  ]);

  const announcementsState = useMemo(
    () => ({
      all: announcementsList,
      // Dismissed - user clicked "x" button (displayed in popup, not dashboard)
      dismissed: announcementsList.filter((ann) => dismissedAnnList?.includes(ann.key || '')) || [],
      // Fresh - not dismissed, displayed on dashboard and popup
      fresh:
        announcementsList.filter(
          (ann) => dismissedAnnList && !dismissedAnnList.includes(ann.key || ''),
        ) || [],
      // Seen - not counted in notification badge couter
      seen: announcementsList.filter((ann) => seenAnnList?.includes(ann.key || '')) || [],
    }),
    [announcementsList, seenAnnList, dismissedAnnList],
  );

  return (
    <AnnouncementsContext.Provider value={announcementsState}>
      {children}
    </AnnouncementsContext.Provider>
  );
};
