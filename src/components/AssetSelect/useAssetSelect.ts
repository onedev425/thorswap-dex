import type { AssetValue } from '@swapkit/core';
import type { AssetFilterOptionType } from 'components/AssetSelect/assetTypes';
import { assetFilterTypes } from 'components/AssetSelect/assetTypes';
import type { AssetSelectProps } from 'components/AssetSelect/types';
import { useCallback, useMemo, useState } from 'react';
import { useAssets } from 'store/assets/hooks';
import { useAppSelector } from 'store/store';

export function useAssetSelect({
  assets = [],
  onSelect,
  onClose,
  typeFilter: initTypeFilter,
}: Pick<AssetSelectProps, 'assets' | 'onClose' | 'onSelect'> & {
  typeFilter?: AssetFilterOptionType;
}) {
  const disabledTokenLists = useAppSelector(({ assets }) => assets.disabledTokenLists);
  const [typeFilter, setTypeFilter] = useState<AssetFilterOptionType>(initTypeFilter || 'all');
  const { toggleTokenList } = useAssets();
  const assetFilterType = useMemo(() => {
    return assetFilterTypes.find((item) => item.value === typeFilter)!;
  }, [typeFilter]);

  const filteredAssets = useMemo(() => {
    if (typeFilter === 'all') return assets;

    const filtered = assets.filter(({ asset: { type } }) =>
      type.toLowerCase().includes(typeFilter.toLowerCase()),
    );

    if (assetFilterType.chainAsset) {
      const chainAssetSelectType = assets.find((a) => assetFilterType.chainAsset?.eq(a.asset));
      if (chainAssetSelectType) {
        filtered.unshift(chainAssetSelectType);
      }
    }

    return filtered;
  }, [assetFilterType.chainAsset, assets, typeFilter]);

  const close = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const select = useCallback(
    (asset: AssetValue) => {
      onSelect(asset);
      close();
    },
    [close, onSelect],
  );

  return {
    close,
    disabledTokenLists,
    filteredAssets,
    select,
    setTypeFilter,
    toggleTokenList,
    typeFilter,
  };
}
