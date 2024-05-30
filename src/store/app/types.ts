import type { FeeOption } from '@swapkit/core';
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

  iframeData: null | {
    address: string;
    basePair: string;
    fee: number;
    logoUrl: string;
    isWidget: boolean;
  };
}
