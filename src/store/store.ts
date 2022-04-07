import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import { configureStore } from '@reduxjs/toolkit'
import type { Action } from '@reduxjs/toolkit'
import type { ThunkAction } from 'redux-thunk'

import rootReducer from './rootReducer'

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = () => useDispatch<AppDispatch>()

export { store }
