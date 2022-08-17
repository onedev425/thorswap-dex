import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import appReducer from './app/slice'
import assetsReducer from './assets/slice'
import externalConfigReducer from './externalConfig/slice'
import midgardReducer from './midgard/slice'
import multisigReducer from './multisig/slice'
import { pathfinderApi } from './pathfinder/api'
import { staticApi } from './static/api'
import { tokensApi } from './tokens/api'
import transactionsReducer from './transactions/slice'
import walletReducer from './wallet/slice'

const rootReducer = combineReducers({
  [tokensApi.reducerPath]: tokensApi.reducer,
  [pathfinderApi.reducerPath]: pathfinderApi.reducer,
  [staticApi.reducerPath]: staticApi.reducer,

  app: appReducer,
  assets: assetsReducer,
  externalConfig: externalConfigReducer,
  midgard: midgardReducer,
  multisig: multisigReducer,
  transactions: transactionsReducer,
  wallet: walletReducer,
})

const store = configureStore({
  devTools: import.meta.env.DEV,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      tokensApi.middleware,
      pathfinderApi.middleware,
      staticApi.middleware,
    ]),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch = () => useDispatch<AppDispatch>()

export { store }
