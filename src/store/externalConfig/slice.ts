import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { AnnouncementsData } from './types'

const initialState = {
  announcements: { manual: [], chainStatus: {} } as AnnouncementsData,
  isTradingGloballyDisabled: false,
}

const externalConfigSlice = createSlice({
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

export const { actions } = externalConfigSlice

export default externalConfigSlice.reducer
