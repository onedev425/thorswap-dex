import { useCallback } from 'react'

import { useSelector } from 'react-redux'

import { Asset } from '@thorswap-lib/multichain-sdk'
import { FeeOption } from '@thorswap-lib/xchain-client'

import { actions } from 'redux/app/slice'
import { RootState, useAppDispatch, useAppSelector } from 'redux/store'

import { multichain } from 'services/multichain'

import { ThemeType } from 'types/global'

import { ExpertOptions } from './types'

export const useApp = () => {
  const dispatch = useAppDispatch()
  const appState = useSelector((state: RootState) => state.app)

  const themeType = useAppSelector(({ app }) => app.themeType)

  const isLightTheme = themeType === ThemeType.LIGHT

  const setTheme = useCallback(
    (theme: ThemeType) => {
      dispatch(actions.setThemeType(theme))
    },
    [dispatch],
  )

  const toggleTheme = useCallback(() => {
    setTheme(isLightTheme ? ThemeType.DARK : ThemeType.LIGHT)
  }, [isLightTheme, setTheme])

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

  const setFeeOptionType = useCallback(
    (feeOption: FeeOption) => {
      // set feeOption for multichain client
      multichain.setFeeOption(feeOption)
      dispatch(actions.setFeeOptionType(feeOption))
    },
    [dispatch],
  )

  const setExpertMode = useCallback(
    (mode: ExpertOptions) => {
      dispatch(actions.setExpertMode(mode))
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

  return {
    ...appState,
    isLightTheme,
    ExpertOptions,
    toggleTheme,
    baseCurrencyAsset,
    setTheme,
    setBaseCurrency,
    toggleSettings,
    toggleSidebar,
    toggleSidebarCollapse,
    setSlippage,
    setAnnStatus,
    setFeeOptionType,
    setReadStatus,
    setExpertMode,
    setWatchList,
  }
}
