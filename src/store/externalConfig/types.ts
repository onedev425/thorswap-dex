import { Chain } from '@thorswap-lib/types';
import { ReactNode } from 'react';

export enum AnnouncementType {
  Primary = 'primary',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export type StatusAnnouncementLink = {
  name?: string;
  url: string;
};

export enum ChainStatusFlag {
  isChainPaused = 'isChainPaused',
  isLPPaused = 'isLPPaused',
  isLPDepositPaused = 'isLPDepositPaused',
  isLPWithdrawalPaused = 'isLPWithdrawalPaused',
  isTradingPaused = 'isTradingPaused',
}

export type ChainStatusFlags = Partial<Record<ChainStatusFlag, boolean>>;

export type AnnouncementItem = {
  type?: AnnouncementType;
  dismissed?: boolean;
  title?: string;
  message: string | ReactNode;
  chain?: Chain;
  link?: StatusAnnouncementLink;
  key?: string;
};

export type StatusAnnouncement = AnnouncementItem & {
  flags?: ChainStatusFlags;
};

export type ChainStatusAnnouncements = Partial<Record<Chain, StatusAnnouncement>>;

export type AnnouncementsData = {
  manual: AnnouncementItem[];
  chainStatus: ChainStatusAnnouncements;
};
