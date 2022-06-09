import { createContext, ReactNode, useContext, useMemo } from 'react'

import { useAnouncementsList } from 'components/Announcements/hooks'
import { AnnouncementsState } from 'components/Announcements/types'

import { useApp } from 'store/app/hooks'

const AnnouncementsContext = createContext<AnnouncementsState>({
  all: [],
  dismissed: [],
  fresh: [],
  seen: [],
})

type Props = {
  children: ReactNode
}

export const useAnnouncements = () => useContext(AnnouncementsContext)

export const AnnouncementsProvider = ({ children }: Props) => {
  const announcementsList = useAnouncementsList()
  const { seenAnnList, dismissedAnnList } = useApp()

  const announcementsState: AnnouncementsState = useMemo(
    () => ({
      all: announcementsList,
      dismissed:
        announcementsList.filter(
          (ann) => dismissedAnnList && dismissedAnnList.includes(ann.key || ''),
        ) || [],
      fresh:
        announcementsList.filter(
          (ann) =>
            dismissedAnnList && !dismissedAnnList.includes(ann.key || ''),
        ) || [],
      seen:
        announcementsList.filter(
          (ann) => seenAnnList && seenAnnList.includes(ann.key || ''),
        ) || [],
    }),
    [announcementsList, seenAnnList, dismissedAnnList],
  )

  return (
    <AnnouncementsContext.Provider value={announcementsState}>
      {children}
    </AnnouncementsContext.Provider>
  )
}
