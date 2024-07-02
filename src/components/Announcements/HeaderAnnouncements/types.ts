import type { ReactNode } from "react";
import type { AnnouncementItem } from "store/externalConfig/types";

export type AnnouncementProps = {
  announcement: AnnouncementItem;
  rightComponent?: ReactNode;
  dismissed?: boolean;
};
