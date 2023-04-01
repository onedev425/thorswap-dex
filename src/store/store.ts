import { type Action, type ThunkAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';

import appReducer from './app/slice';
import assetsReducer from './assets/slice';
import midgardReducer from './midgard/slice';
import multisigReducer from './multisig/slice';
import { staticApi } from './static/api';
import { thorswapApi } from './thorswap/api';
import transactionsReducer from './transactions/slice';
import walletReducer from './wallet/slice';

const devTools = import.meta.env.DEV;

const rootReducer = combineReducers({
  [staticApi.reducerPath]: staticApi.reducer,
  [thorswapApi.reducerPath]: thorswapApi.reducer,

  app: appReducer,
  assets: assetsReducer,
  midgard: midgardReducer,
  multisig: multisigReducer,
  transactions: transactionsReducer,
  wallet: walletReducer,
});

const store = configureStore({
  devTools,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      staticApi.middleware,
      thorswapApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export { store };
