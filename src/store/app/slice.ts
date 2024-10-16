import { type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { AssetValue } from "@swapkit/sdk";
import { FeeOption } from "@swapkit/sdk";
import { getFromStorage, saveInStorage } from "helpers/storage";
import type { SupportedLanguages, ThemeType, ThousandSeparator, ViewMode } from "types/app";

import type { State } from "./types";

const initialState: State = {
  customRecipientMode: getFromStorage("customRecipientMode") as boolean,
  autoRouter: getFromStorage("autoRouter") as boolean,
  baseCurrency: getFromStorage("baseCurrency") as string,
  expertMode: getFromStorage("expertMode") as boolean,
  feeOptionType: FeeOption.Fast,
  isAnnOpen: !getFromStorage("annViewStatus") as boolean,
  hideStats: getFromStorage("statsHidden") as boolean,
  multisigVisible: getFromStorage("multisigVisible") as boolean,
  customSendVisible: getFromStorage("customSendVisible") as boolean,
  hideCharts: getFromStorage("chartsHidden") as boolean,
  dismissedAnnList: getFromStorage("dismissedAnnList") as string[],
  seenAnnList: getFromStorage("seenAnnList") as string[],
  collapsedSidebarGroups: getFromStorage("collapsedSidebarGroups") as string[],
  isSidebarCollapsed: getFromStorage("sidebarCollapsed") as boolean,
  isSettingOpen: false,
  isSidebarOpen: false,
  analyticsVisible: getFromStorage("analyticsVisible") as boolean,
  language: getFromStorage("language") as SupportedLanguages,
  nodeWatchList: getFromStorage("nodeWatchList") as string[],
  showAnnouncement: !getFromStorage("readStatus") as boolean,
  slippageTolerance: Number(getFromStorage("slippageTolerance") as string),
  themeType: getFromStorage("themeType") as ThemeType,
  thousandSeparator: getFromStorage("thousandSeparator") as ThousandSeparator,
  transactionDeadline: Number(getFromStorage("transactionDeadline") as string),
  walletViewMode: getFromStorage("walletViewMode") as ViewMode,

  iframeData: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setThemeType(state, { payload }: PayloadAction<ThemeType>) {
      state.themeType = payload;
      saveInStorage({ key: "themeType", value: payload });
    },

    setBaseCurrency(state, action: PayloadAction<AssetValue>) {
      const assetString = action.payload.toString();
      state.baseCurrency = assetString;

      saveInStorage({ key: "baseCurrency", value: assetString });
    },
    setSettingsOpen(state, action: PayloadAction<boolean>) {
      state.isSettingOpen = action.payload;
    },
    toggleSettings(state) {
      state.isSettingOpen = !state.isSettingOpen;
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSlippage(state, action: PayloadAction<number>) {
      const slippage = Math.min(100, Math.max(0, action.payload));
      state.slippageTolerance = slippage;
      saveInStorage({ key: "slippageTolerance", value: String(slippage) });
    },
    setTransactionDeadline(state, action: PayloadAction<number>) {
      state.transactionDeadline = action.payload;
      saveInStorage({
        key: "transactionDeadline",
        value: String(action.payload),
      });
    },
    setFeeOptionType(state, action: PayloadAction<FeeOption>) {
      state.feeOptionType = action.payload;
    },
    setExpertMode(state, action: PayloadAction<boolean>) {
      state.expertMode = action.payload;
      saveInStorage({
        key: "expertMode",
        value: action.payload,
      });
    },
    setCustomRecipientMode(state, action: PayloadAction<boolean>) {
      state.customRecipientMode = action.payload;
      saveInStorage({
        key: "customRecipientMode",
        value: action.payload,
      });
    },
    setAutoRouter(state, action: PayloadAction<boolean>) {
      state.autoRouter = action.payload;
      saveInStorage({
        key: "autoRouter",
        value: action.payload,
      });
    },
    setReadStatus(state, action: PayloadAction<boolean>) {
      state.showAnnouncement = !action.payload;
      saveInStorage({ key: "readStatus", value: action.payload });
    },
    setAnnStatus(state, action: PayloadAction<boolean>) {
      state.isAnnOpen = !action.payload;
      saveInStorage({ key: "annViewStatus", value: action.payload });
    },
    setWatchList(state, action: PayloadAction<string[]>) {
      state.nodeWatchList = action.payload;
      saveInStorage({ key: "nodeWatchList", value: action.payload });
    },
    setLanguage(state, action: PayloadAction<SupportedLanguages>) {
      state.language = action.payload;
      saveInStorage({ key: "language", value: action.payload });
    },
    setThousandSeparator(state, action: PayloadAction<ThousandSeparator>) {
      state.thousandSeparator = action.payload;
      saveInStorage({ key: "thousandSeparator", value: action.payload });
    },
    setWalletViewMode(state, action: PayloadAction<ViewMode>) {
      state.walletViewMode = action.payload;
      saveInStorage({ key: "walletViewMode", value: action.payload });
    },
    setStatsShowStatus(state, action: PayloadAction<boolean>) {
      state.hideStats = action.payload;
      saveInStorage({ key: "statsHidden", value: action.payload });
    },
    setMultisigShowStatus(state, action: PayloadAction<boolean>) {
      state.multisigVisible = action.payload;
      saveInStorage({ key: "multisigVisible", value: action.payload });
    },
    setCustomMemoShowStatus(state, action: PayloadAction<boolean>) {
      state.customSendVisible = action.payload;
      saveInStorage({ key: "customSendVisible", value: action.payload });
    },
    setChartsShowStatus(state, action: PayloadAction<boolean>) {
      state.hideCharts = action.payload;
      saveInStorage({ key: "chartsHidden", value: action.payload });
    },
    setAnnDismissedList(state, action: PayloadAction<string[]>) {
      state.dismissedAnnList = action.payload;
      saveInStorage({ key: "dismissedAnnList", value: action.payload });
    },
    setAnnSeenList(state, action: PayloadAction<string[]>) {
      state.seenAnnList = action.payload;
      saveInStorage({ key: "seenAnnList", value: action.payload });
    },
    toggleSidebarCollapse(state, action: PayloadAction<boolean>) {
      state.isSidebarCollapsed = action.payload;
      saveInStorage({ key: "sidebarCollapsed", value: action.payload });
    },
    setCollapsedSidebarGroups(state, action: PayloadAction<string[]>) {
      state.collapsedSidebarGroups = action.payload;
      saveInStorage({ key: "collapsedSidebarGroups", value: action.payload });
    },
    toggleAnalytics(state, action: PayloadAction<boolean>) {
      state.analyticsVisible = action.payload;
      saveInStorage({ key: "analyticsVisible", value: action.payload });
    },

    setIframeData(state, action: PayloadAction<State["iframeData"]>) {
      state.iframeData = action.payload;
    },
  },
});

export const { actions } = appSlice;

export default appSlice.reducer;
