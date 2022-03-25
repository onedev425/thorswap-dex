import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Asset } from '@thorswap-lib/multichain-sdk'
import { FeeOption } from '@thorswap-lib/xchain-client'

import { getFromStorage, saveInStorage } from 'helpers/storage'

import {
  SupportedLanguages,
  ThemeType,
  ThousandSeparator,
  ViewMode,
} from 'types/global'

import { State } from './types'

const initialState: State = {
  autoRouter: getFromStorage('autoRouter') as boolean,
  baseCurrency: getFromStorage('baseCurrency') as string,
  expertMode: getFromStorage('expertMode') as boolean,
  feeOptionType: FeeOption.Fast,
  isAnnOpen: !getFromStorage('annViewStatus') as boolean,
  isSettingOpen: false,
  isSidebarCollapsed: false,
  isSidebarOpen: false,
  language: 'en',
  nodeWatchList: getFromStorage('nodeWatchList') as string[],
  showAnnouncement: !getFromStorage('readStatus') as boolean,
  slippageTolerance: Number(getFromStorage('slippageTolerance') as string),
  themeType: getFromStorage('themeType') as ThemeType,
  thousandSeparator: getFromStorage('thousandSeparator') as ThousandSeparator,
  transactionDeadline: Number(getFromStorage('transactionDeadline') as string),
  walletViewMode: getFromStorage('walletViewMode') as ViewMode,
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
      saveInStorage({ key: 'slippageTolerance', value: String(slippage) })
    },
    setTransactionDeadline(state, action: PayloadAction<number>) {
      state.transactionDeadline = action.payload
      saveInStorage({
        key: 'transactionDeadline',
        value: String(action.payload),
      })
    },
    setFeeOptionType(state, action: PayloadAction<FeeOption>) {
      state.feeOptionType = action.payload
    },
    setExpertMode(state, action: PayloadAction<boolean>) {
      state.expertMode = action.payload
      saveInStorage({
        key: 'expertMode',
        value: action.payload,
      })
    },
    setAutoRouter(state, action: PayloadAction<boolean>) {
      state.autoRouter = action.payload
      saveInStorage({
        key: 'autoRouter',
        value: action.payload,
      })
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
    setWalletViewMode(state, action: PayloadAction<ViewMode>) {
      state.walletViewMode = action.payload

      saveInStorage({ key: 'walletViewMode', value: action.payload })
    },
  },
})

export const { reducer, actions } = appSlice

export default appSlice
