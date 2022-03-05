import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Asset } from '@thorswap-lib/multichain-sdk'
import { FeeOption } from '@thorswap-lib/xchain-client'

import { getFromStorage, saveInStorage } from 'helpers/storage'

import { DEFAULT_SLIPPAGE_TOLERANCE } from 'settings/constants/global'

import { SupportedLanguages, ThemeType, ThousandSeparator } from 'types/global'

import { ExpertOptions, State } from './types'

const initialState: State = {
  themeType: getFromStorage('themeType') as ThemeType,
  language: 'en',
  showAnnouncement: !getFromStorage('readStatus') as boolean,
  baseCurrency: getFromStorage('baseCurrency') as string,
  thousandSeparator: getFromStorage('thousandSeparator') as ThousandSeparator,
  isSettingOpen: false,
  isAnnOpen: !getFromStorage('annViewStatus') as boolean,
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  slippageTolerance: DEFAULT_SLIPPAGE_TOLERANCE,
  feeOptionType: FeeOption.Fast,
  expertMode: ExpertOptions.off,
  nodeWatchList: getFromStorage('nodeWatchList') as string[],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeType(state, { payload }: PayloadAction<ThemeType>) {
      state.themeType = payload
      saveInStorage({ key: 'themeType', value: payload })
    },

    setBaseCurrency(state, action: PayloadAction<Asset>) {
      const assetString = action.payload.toString()
      state.baseCurrency = assetString

      saveInStorage({ key: 'baseCurrency', value: assetString })
    },
    setSettingsOpen(state, action: PayloadAction<boolean>) {
      state.isSettingOpen = action.payload
    },
    toggleSettings(state) {
      state.isSettingOpen = !state.isSettingOpen
    },
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    toggleSidebarCollapse(state) {
      state.isSidebarCollapsed = !state.isSidebarCollapsed
    },
    setSlippage(state, action: PayloadAction<number>) {
      const slippage =
        action.payload > 100 ? 100 : action.payload < 0 ? 0 : action.payload

      state.slippageTolerance = slippage
    },
    setFeeOptionType(state, action: PayloadAction<FeeOption>) {
      state.feeOptionType = action.payload
    },
    setExpertMode(state, action: PayloadAction<ExpertOptions>) {
      state.expertMode = action.payload
    },
    setReadStatus(state, action: PayloadAction<boolean>) {
      state.showAnnouncement = !action.payload
      saveInStorage({ key: 'readStatus', value: action.payload })
    },
    setAnnStatus(state, action: PayloadAction<boolean>) {
      state.isAnnOpen = !action.payload
      saveInStorage({ key: 'annViewStatus', value: action.payload })
    },
    setWatchList(state, action: PayloadAction<string[]>) {
      state.nodeWatchList = action.payload
      saveInStorage({ key: 'nodeWatchList', value: action.payload })
    },
    setLanguage(state, action: PayloadAction<SupportedLanguages>) {
      state.language = action.payload
      saveInStorage({ key: 'language', value: action.payload })
    },
    setThousandSeparator(state, action: PayloadAction<ThousandSeparator>) {
      state.thousandSeparator = action.payload
      saveInStorage({ key: 'thousandSeparator', value: action.payload })
    },
  },
})

export const { reducer, actions } = appSlice

export default appSlice
