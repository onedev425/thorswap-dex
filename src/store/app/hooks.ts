import type { FeeOption } from "@swapkit/sdk";
import { AssetValue } from "@swapkit/sdk";
import { USDAsset } from "helpers/assets";
import { useCallback } from "react";
import { actions } from "store/app/slice";
import { useAppDispatch, useAppSelector } from "store/store";
import type { SupportedLanguages, ThemeType, ThousandSeparator, ViewMode } from "types/app";

export const useApp = () => {
  const dispatch = useAppDispatch();
  const appState = useAppSelector(({ app }) => app);

  const setTheme = useCallback(
    (theme: ThemeType) => {
      dispatch(actions.setThemeType(theme));
    },
    [dispatch],
  );

  const baseCurrencyAsset =
    appState.baseCurrency === "THOR.USD"
      ? USDAsset
      : AssetValue.fromStringSync(appState.baseCurrency);

  const setBaseCurrency = useCallback(
    (baseAsset: AssetValue) => {
      dispatch(actions.setBaseCurrency(baseAsset));
    },
    [dispatch],
  );

  const toggleSettings = useCallback(() => {
    dispatch(actions.toggleSettings());
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    dispatch(actions.toggleSidebar());
  }, [dispatch]);

  const toggleSidebarCollapse = useCallback(
    (sidebarCollapsed: boolean) => {
      dispatch(actions.toggleSidebarCollapse(sidebarCollapsed));
    },
    [dispatch],
  );

  const setSlippage = useCallback(
    (slip: number) => {
      dispatch(actions.setSlippage(slip));
    },
    [dispatch],
  );

  const setTransactionDeadline = useCallback(
    (slip: number) => {
      dispatch(actions.setTransactionDeadline(slip));
    },
    [dispatch],
  );

  const setFeeOptionType = useCallback(
    (feeOption: FeeOption) => {
      dispatch(actions.setFeeOptionType(feeOption));
    },
    [dispatch],
  );

  const setExpertMode = useCallback(
    (isActive: boolean) => {
      dispatch(actions.setExpertMode(isActive));
    },
    [dispatch],
  );

  const setCustomRecipientMode = useCallback(
    (isActive: boolean) => {
      dispatch(actions.setCustomRecipientMode(isActive));
    },
    [dispatch],
  );

  const setAutoRouter = useCallback(
    (isActive: boolean) => {
      dispatch(actions.setAutoRouter(isActive));
    },
    [dispatch],
  );

  const setReadStatus = useCallback(
    (readStatus: boolean) => {
      dispatch(actions.setReadStatus(readStatus));
    },
    [dispatch],
  );

  const setAnnStatus = useCallback(
    (isAnnOpen: boolean) => {
      dispatch(actions.setAnnStatus(isAnnOpen));
    },
    [dispatch],
  );

  const setStatsShowStatus = useCallback(
    (areStatsShown: boolean) => {
      dispatch(actions.setStatsShowStatus(areStatsShown));
    },
    [dispatch],
  );

  const setMultisigShowStatus = useCallback(
    (isMultisigShown: boolean) => {
      dispatch(actions.setMultisigShowStatus(isMultisigShown));
    },
    [dispatch],
  );

  const setCustomSendShowStatus = useCallback(
    (isShown: boolean) => {
      dispatch(actions.setCustomMemoShowStatus(isShown));
    },
    [dispatch],
  );

  const setCustomDerivationShowStatus = useCallback(
    (isShown: boolean) => {
      dispatch(actions.setCustomDerivationShowStatus(isShown));
    },
    [dispatch],
  );

  const setChartsShowStatus = useCallback(
    (areChartsShown: boolean) => {
      dispatch(actions.setChartsShowStatus(areChartsShown));
    },
    [dispatch],
  );

  const setAnnDismissedList = useCallback(
    (dismissedAnnList: string[]) => {
      dispatch(actions.setAnnDismissedList(dismissedAnnList));
    },
    [dispatch],
  );

  const setAnnSeenList = useCallback(
    (seenAnnList: string[]) => {
      dispatch(actions.setAnnSeenList(seenAnnList));
    },
    [dispatch],
  );

  const setWatchList = useCallback(
    (watchList: string[]) => {
      dispatch(actions.setWatchList(watchList));
    },
    [dispatch],
  );

  const setLanguage = useCallback(
    (language: SupportedLanguages) => {
      dispatch(actions.setLanguage(language));
    },
    [dispatch],
  );

  const setThousandSeparator = useCallback(
    (val: ThousandSeparator) => {
      dispatch(actions.setThousandSeparator(val));
    },
    [dispatch],
  );

  const setWalletViewMode = useCallback(
    (val: ViewMode) => {
      dispatch(actions.setWalletViewMode(val));
    },
    [dispatch],
  );

  const setCollapsedSidebarGroups = useCallback(
    (collapsedSidebarGroups: string[]) => {
      dispatch(actions.setCollapsedSidebarGroups(collapsedSidebarGroups));
    },
    [dispatch],
  );

  const toggleAnalytics = useCallback(
    (analyticsVisible: boolean) => {
      dispatch(actions.toggleAnalytics(analyticsVisible));
    },
    [dispatch],
  );

  return {
    ...appState,
    baseCurrencyAsset,
    setAnnStatus,
    setAutoRouter,
    setBaseCurrency,
    setExpertMode,
    setCustomRecipientMode,
    setFeeOptionType,
    setLanguage,
    setReadStatus,
    setSlippage,
    setTheme,
    setThousandSeparator,
    setTransactionDeadline,
    setWalletViewMode,
    setWatchList,
    toggleSettings,
    toggleSidebar,
    toggleSidebarCollapse,
    setStatsShowStatus,
    setChartsShowStatus,
    setAnnDismissedList,
    setAnnSeenList,
    setMultisigShowStatus,
    setCustomSendShowStatus,
    setCustomDerivationShowStatus,
    setCollapsedSidebarGroups,
    toggleAnalytics,
  };
};
