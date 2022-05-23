import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { AnnouncementsData, State } from './types'

const initialState: State = {
  announcements: { manual: [], chainStatus: {} },
  isTradingGloballyDisabled: false,
}

const assetsSlice = createSlice({
  name: 'externalConfig',
  initialState,
  reducers: {
    setAnnouncements(state, { payload }: PayloadAction<AnnouncementsData>) {
      state.announcements = payload
    },
    setTradingGloballyDisabled(state, { payload }: PayloadAction<boolean>) {
      state.isTradingGloballyDisabled = payload
    },
  },
})

export const { reducer, actions } = assetsSlice

export default assetsSlice
