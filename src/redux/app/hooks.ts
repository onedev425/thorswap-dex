import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { FeeOption } from '@thorswap-lib/xchain-client'

import { actions } from 'redux/app/slice'
import { RootState, useAppDispatch } from 'redux/store'

import { multichain } from 'services/multichain'

import {
  SupportedLanguages,
  ThemeType,
  ThousandSeparator,
  ViewMode,
} from 'types/global'

export const useApp = () => {
  const dispatch = useAppDispatch()
  const appState = useSelector((state: RootState) => state.app)

  const setTheme = useCallback(
    (theme: ThemeType) => {
      dispatch(actions.setThemeType(theme))
    },
    [dispatch],
  )

  const baseCurrencyAsset =
    Asset.fromAssetString(appState.baseCurrency) || Asset.USD()

  const setBaseCurrency = useCallback(
    (baseAsset: Asset) => {
      dispatch(actions.setBaseCurrency(baseAsset))
    },
    [dispatch],
  )

  const toggleSettings = useCallback(() => {
    dispatch(actions.toggleSettings())
  }, [dispatch])

  const toggleSidebar = useCallback(() => {
    dispatch(actions.toggleSidebar())
  }, [dispatch])

  const toggleSidebarCollapse = useCallback(() => {
    dispatch(actions.toggleSidebarCollapse())
  }, [dispatch])

  const setSlippage = useCallback(
    (slip: number) => {
      dispatch(actions.setSlippage(slip))
    },
    [dispatch],
  )

  const setTransactionDeadline = useCallback(
    (slip: number) => {
      dispatch(actions.setTransactionDeadline(slip))
    },
    [dispatch],
  )

  const setFeeOptionType = useCallback(
    (feeOption: FeeOption) => {
      // set feeOption for multichain client
      multichain.setFeeOption(feeOption)
      dispatch(actions.setFeeOptionType(feeOption))
    },
    [dispatch],
  )

  const setExpertMode = useCallback(
    (isActive: boolean) => {
      dispatch(actions.setExpertMode(isActive))
    },
    [dispatch],
  )

  const setAutoRouter = useCallback(
    (isActive: boolean) => {
      dispatch(actions.setAutoRouter(isActive))
    },
    [dispatch],
  )

  const setReadStatus = useCallback(
    (readStatus: boolean) => {
      dispatch(actions.setReadStatus(readStatus))
    },
    [dispatch],
  )

  const setAnnStatus = useCallback(
    (isAnnOpen: boolean) => {
      dispatch(actions.setAnnStatus(isAnnOpen))
    },
    [dispatch],
  )

  const setWatchList = useCallback(
    (watchList: string[]) => {
      dispatch(actions.setWatchList(watchList))
    },
    [dispatch],
  )

  const setLanguage = useCallback(
    (language: SupportedLanguages) => {
      dispatch(actions.setLanguage(language))
    },
    [dispatch],
  )

  const setThousandSeparator = useCallback(
    (val: ThousandSeparator) => {
      dispatch(actions.setThousandSeparator(val))
    },
    [dispatch],
  )

  const setWalletViewMode = useCallback(
    (val: ViewMode) => {
      dispatch(actions.setWalletViewMode(val))
    },
    [dispatch],
  )

  return {
    ...appState,
    baseCurrencyAsset,
    setAnnStatus,
    setAutoRouter,
    setBaseCurrency,
    setExpertMode,
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
  }
}
