import type { FeeOption } from '@thorswap-lib/types';
import type { SupportedLanguages, ThemeType, ThousandSeparator, ViewMode } from 'types/app';

export interface State {
  isAnnOpen: boolean;
  showAnnouncement: boolean;
  isSettingOpen: boolean;
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  //
  autoRouter: boolean;
  baseCurrency: string;
  // swap & liquidity options
  expertMode: boolean;
  customRecipientMode: boolean;
  feeOptionType: FeeOption;
  slippageTolerance: number;
  //
  language: SupportedLanguages;
  nodeWatchList: string[];
  themeType: ThemeType;
  thousandSeparator: ThousandSeparator;
  transactionDeadline: number;
  walletViewMode: ViewMode;
  hideStats: boolean;
  multisigVisible: boolean;
  customSendVisible: boolean;
  customDerivationVisible: boolean;
  hideCharts: boolean;
  dismissedAnnList: string[];
  seenAnnList: string[];
  collapsedSidebarGroups: string[];
  analyticsVisible: boolean;
}
