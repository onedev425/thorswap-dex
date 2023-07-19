import { Chain } from '@thorswap-lib/types';
import { AssetSelectType } from 'components/AssetSelect/types';
import Fuse from 'fuse.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SORTED_CHAINS, SUPPORTED_CHAINS } from 'settings/chain';
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

const uniqBy = <T>(arr: T[], predicate: (item: T) => boolean | string) => {
  const cb = typeof predicate === 'function' ? predicate : (o: any) => o[predicate];

  return [
    ...arr
      .reduce((map, item) => {
        const key = item === null || item === undefined ? item : cb(item);
        map.has(key) || map.set(key, item);
        return map;
      }, new Map())
      .values(),
  ];
};

const SUPPORTED_ASSET_CHAINS = SUPPORTED_CHAINS.filter(
  (chain) => ![Chain.BinanceSmartChain].includes(chain),
);

export const useAssetListSearch = (assetList: AssetSelectType[]) => {
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
      if (a.balance || b.balance) {
        return a.balance ? (b?.balance?.gt(a.balance) ? 1 : -1) : 0;
      } else {
        // TODO - remove TS ignore once new chains have been added
        // @ts-expect-error
        return SORTED_CHAINS.indexOf(a.asset.chain) - SORTED_CHAINS.indexOf(b.asset.chain);
      }
    });

    const uniqueAssets = uniqBy(sortedAssets, ({ asset }) => asset.toString());

    const supportedAssets = uniqueAssets.filter(
      ({ asset }) =>
        SUPPORTED_ASSET_CHAINS.includes(asset.chain) &&
        !(asset.chain === Chain.Avalanche && asset.symbol.includes('THOR-')),
    );

    return supportedAssets;
  }, [assetList, query]);

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
