import type { AnnouncementItem } from "store/externalConfig/types";

export type AnnouncementsState = {
  all: AnnouncementItem[];
  dismissed: AnnouncementItem[];
  fresh: AnnouncementItem[];
  seen: AnnouncementItem[];
};
