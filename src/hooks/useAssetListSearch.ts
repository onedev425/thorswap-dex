import { AssetSelectType } from 'components/AssetSelect/types';
import Fuse from 'fuse.js';
import uniqBy from 'lodash/uniqBy';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAssets } from 'store/assets/hooks';
import { useTokenList } from 'views/Swap/hooks/useTokenList';

const options: Fuse.IFuseOptions<AssetSelectType> = {
  keys: [
    { name: 'asset.ticker', weight: 1 },
    { name: 'asset.name', weight: 0.5 },
    { name: 'asset.type', weight: 0.1 },
    { name: 'cg.name', weight: 0.1 },
    { name: 'cg.id', weight: 0.01 },
  ],
  isCaseSensitive: false,
  minMatchCharLength: 1,
  threshold: 0.1,
};

export const useAssetListSearch = (assetList: AssetSelectType[]) => {
  const { isFeatured, isFrequent } = useAssets();
  const { isLoading } = useTokenList();
  const fuse = useRef<Fuse<AssetSelectType>>(new Fuse([], options));
  const [query, setQuery] = useState('');

  useEffect(() => {
    fuse.current = new Fuse<AssetSelectType>(assetList, options);
  }, [assetList]);

  const assets = useMemo(() => {
    const searchedAssets =
      query.length > 0
        ? fuse.current.search(query, { limit: 50 }).map(({ item }) => item)
        : assetList;

    const sortedAssets = searchedAssets.concat().sort((a, b) => {
      const aFeatured = isFeatured(a);
      const aFrequent = isFrequent(a);
      const bFeatured = isFeatured(b);

      if (!a.balance && !b.balance) {
        if (a.asset.type === 'Native') return -1;
        if (b.asset.type === 'Native') return 1;
        if (aFeatured || (aFrequent && !bFeatured)) {
          return -1;
        }
        const mcDiff = (b?.cg?.market_cap || 0) - (a?.cg?.market_cap || 0);

        return mcDiff;
      }

      if (!a.balance) return 1;
      if (!b.balance) return -1;

      return bFeatured ? 1 : aFeatured ? -1 : b.balance.gt(a.balance) ? 1 : -1;
    });

    return uniqBy(sortedAssets, ({ asset }) => asset.toString());
  }, [assetList, isFeatured, isFrequent, query]);

  const assetInputProps = useMemo(
    () => ({
      isLoading: isLoading,
      query,
      setQuery,
    }),
    [query, isLoading],
  );

  return { assets, assetInputProps };
};
