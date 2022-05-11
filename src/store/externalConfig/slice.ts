import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { Announcement, State } from './types'

const initialState: State = {
  announcements: [],
  isTradingGloballyDisabled: false,
}

const assetsSlice = createSlice({
  name: 'externalConfig',
  initialState,
  reducers: {
    setAnnouncements(state, { payload }: PayloadAction<Announcement[]>) {
      state.announcements = payload
    },
    setTradingGloballyDisabled(state, { payload }: PayloadAction<boolean>) {
      state.isTradingGloballyDisabled = payload
    },
  },
})

export const { reducer, actions } = assetsSlice

export default assetsSlice
