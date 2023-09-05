import type { AssetSelectType } from 'components/AssetSelect/types';
import { useCallback } from 'react';
import { actions } from 'store/assets/slice';
import { useAppDispatch, useAppSelector } from 'store/store';

export const useAssets = () => {
  const { frequent, featured } = useAppSelector((state) => state.assets);
  const dispatch = useAppDispatch();

  const addFrequent = useCallback(
    (asset: string) => {
      dispatch(actions.addFrequent(asset));
    },
    [dispatch],
  );

  const addFeatured = useCallback(
    (asset: string) => {
      dispatch(actions.addFeatured(asset));
    },
    [dispatch],
  );

  const removeFeatured = useCallback(
    (asset: string) => {
      dispatch(actions.removeFeatured(asset));
    },
    [dispatch],
  );

  const toggleTokenList = useCallback(
    (tokenListName: string) => {
      dispatch(actions.toggleTokenList(tokenListName));
    },
    [dispatch],
  );

  const isFrequent = useCallback(
    (assetSelect: AssetSelectType) =>
      assetSelect && frequent.includes(`${assetSelect.asset?.symbol}-${assetSelect.identifier}`),
    [frequent],
  );

  const isFeatured = useCallback(
    (assetSelect: AssetSelectType) =>
      assetSelect && featured.includes(`${assetSelect.asset?.symbol}-${assetSelect.identifier}`),
    [featured],
  );

  return {
    addFrequent,
    toggleTokenList,
    addFeatured,
    removeFeatured,
    isFrequent,
    isFeatured,
  };
};
