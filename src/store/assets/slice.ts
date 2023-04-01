import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getFromStorage, saveInStorage } from 'helpers/storage';

const MAX_FEATURED_ASSETS = 5;

const initialState = {
  disabledTokenLists: getFromStorage('disabledTokenLists') as string[],
  featured: getFromStorage('featuredAssets') as string[],
  frequent: getFromStorage('frequentAssets') as string[],
};

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addFrequent: (state, { payload }: PayloadAction<string>) => {
      const merged = [payload, ...state.frequent];
      const frequent = Array.from(new Set(merged)).slice(0, MAX_FEATURED_ASSETS);
      state.frequent = frequent;
      saveInStorage({ key: 'frequentAssets', value: frequent });
    },
    addFeatured: (state, { payload }: PayloadAction<string>) => {
      const featured = [payload, ...state.featured].slice(0, MAX_FEATURED_ASSETS);
      state.featured = featured;
      saveInStorage({ key: 'featuredAssets', value: featured });
    },
    removeFeatured: (state, { payload }: PayloadAction<string>) => {
      const featured = state.featured.filter((a) => a !== payload);
      state.featured = featured;
      saveInStorage({ key: 'featuredAssets', value: featured });
    },
    toggleTokenList: (state, { payload }: PayloadAction<string>) => {
      state.disabledTokenLists = state.disabledTokenLists.includes(payload)
        ? state.disabledTokenLists.filter((a) => a !== payload)
        : [...state.disabledTokenLists, payload];

      saveInStorage({
        key: 'disabledTokenLists',
        value: state.disabledTokenLists,
      });
    },
  },
});

export const { actions } = assetsSlice;

export default assetsSlice.reducer;
