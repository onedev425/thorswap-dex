import { useCallback, useMemo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetFilterOptionType } from 'components/AssetSelect/assetTypes'
import { AssetSelectProps } from 'components/AssetSelect/types'

import { useAssets } from 'store/assets/hooks'

export function useAssetSelect({
  assets,
  onSelect,
  onClose,
}: AssetSelectProps) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssetFilterOptionType>('all')
  const { featured } = useAssets()

  const featuredAssets = useMemo(
    () =>
      featured
        .map((ticker) => Asset.fromAssetString(ticker))
        .filter(Boolean) as Asset[],
    [featured],
  )

  const assetsFilteredByType = useMemo(() => {
    const searchedAssets = search
      ? assets.filter(({ asset: { symbol } }) =>
          symbol.toLocaleLowerCase().includes(search.toLowerCase()),
        )
      : assets

    return typeFilter === 'all'
      ? searchedAssets
      : searchedAssets.filter(
          ({ asset: { type } }) => type.toLowerCase() === typeFilter,
        )
  }, [assets, search, typeFilter])

  const filteredAssets = useMemo(
    () =>
      assetsFilteredByType
        .concat()
        .sort((a, b) => a.asset.sortsBefore(b.asset))
        .sort((a) => (featuredAssets.some((fa) => fa.eq(a.asset)) ? -1 : 1)),
    [assetsFilteredByType, featuredAssets],
  )

  const resetSearch = () => setSearch('')

  const close = useCallback(() => {
    onClose?.()
    resetSearch()
  }, [onClose])

  const select = useCallback(
    (asset: Asset) => {
      onSelect(asset)
      close()
    },
    [close, onSelect],
  )

  const setTypeFilterOption = useCallback((val: string) => {
    setTypeFilter(val as AssetFilterOptionType)
  }, [])

  return {
    search,
    setSearch,
    filteredAssets,
    select,
    close,
    typeFilter,
    setTypeFilterOption,
  }
}
