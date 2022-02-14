import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { State } from './types'

const initialState: State = {
  isConnectModalOpen: false,
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setIsConnectModalOpen(state, action: PayloadAction<boolean>) {
      state.isConnectModalOpen = action.payload
    },
  },
})

export const { reducer, actions } = slice
export default slice
