import { type Action, combineReducers, configureStore, type ThunkAction } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { midgardApi } from 'store/midgard/api';
import { trpcApi } from 'store/trpcApi/api';

import appReducer from './app/slice';
import assetsReducer from './assets/slice';
import multisigReducer from './multisig/slice';
import { staticApi } from './static/api';
import { thorswapApi } from './thorswap/api';
import transactionsReducer from './transactions/slice';

const devTools = import.meta.env.DEV;

const rootReducer = combineReducers({
  [midgardApi.reducerPath]: midgardApi.reducer,
  [staticApi.reducerPath]: staticApi.reducer,
  [thorswapApi.reducerPath]: thorswapApi.reducer,
  [trpcApi.reducerPath]: trpcApi.reducer,

  app: appReducer,
  assets: assetsReducer,
  multisig: multisigReducer,
  transactions: transactionsReducer,
});

const store = configureStore({
  devTools,
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat([
      midgardApi.middleware,
      thorswapApi.middleware,
      staticApi.middleware,
      trpcApi.middleware,
    ]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export { store };
