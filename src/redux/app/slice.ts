import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Asset } from '@thorswap-lib/multichain-sdk'
import { FeeOption } from '@thorswap-lib/xchain-client'

import {
  saveBaseCurrency,
  getBaseCurrency,
  getReadStatus,
  setReadStatus,
  setAnnViewStatus,
  getNodeWatchList,
  setNodeWatchList,
  getAnnViewStatus,
} from 'helpers/storage'

import { DEFAULT_SLIPPAGE_TOLERANCE } from 'settings/constants/global'

import { ThemeType } from 'types/global'

import { ExpertOptions, State } from './types'

const initialState: State = {
  themeType: ThemeType.DARK,
  showAnnouncement: !getReadStatus(),
  baseCurrency: getBaseCurrency(),
  isSettingOpen: false,
  isAnnOpen: !getAnnViewStatus(),
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  slippageTolerance: DEFAULT_SLIPPAGE_TOLERANCE,
  feeOptionType: FeeOption.Fast,
  expertMode: ExpertOptions.off,
  nodeWatchList: getNodeWatchList(),
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeType(state, { payload }: PayloadAction<ThemeType>) {
      state.themeType = payload
    },

    setBaseCurrency(state, action: PayloadAction<Asset>) {
      const assetString = action.payload.toString()
      state.baseCurrency = assetString

      saveBaseCurrency(assetString)
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
      setReadStatus(action.payload)
    },
    setAnnStatus(state, action: PayloadAction<boolean>) {
      state.isAnnOpen = !action.payload
      setAnnViewStatus(action.payload)
    },
    setWatchList(state, action: PayloadAction<string[]>) {
      state.nodeWatchList = action.payload
      setNodeWatchList(action.payload)
    },
  },
})

export const { reducer, actions } = appSlice

export default appSlice
