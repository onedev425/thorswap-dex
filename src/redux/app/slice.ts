import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { ThemeType } from 'types/global'

import { State } from './types'

const initialState: State = {
  themeType: ThemeType.DARK,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setThemeType(state, { payload }: PayloadAction<ThemeType>) {
      state.themeType = payload
    },
  },
})

export const { reducer, actions } = appSlice

export default appSlice
