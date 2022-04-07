import { useMemo, useState } from 'react'

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
  const featuredAssets = featured
    .map((ticker) => Asset.fromAssetString(ticker))
    .filter(Boolean) as Asset[]

  const filteredAssets = useMemo(() => {
    let filteredAssetData = !search
      ? assets
      : assets.filter(({ asset }) =>
          asset.symbol.toLocaleLowerCase().includes(search.toLowerCase()),
        )

    filteredAssetData =
      typeFilter === 'all'
        ? filteredAssetData
        : filteredAssetData.filter(
            ({ asset }) =>
              asset.type.toLowerCase() === typeFilter.toLowerCase(),
          )
    filteredAssetData.sort((a, b) => a.asset.sortsBefore(b.asset))
    filteredAssetData.sort((a) =>
      featuredAssets.some((fa) => fa.eq(a.asset)) ? -1 : 1,
    )

    return filteredAssetData
  }, [assets, featuredAssets, search, typeFilter])

  const resetSearch = () => setSearch('')

  const close = () => {
    onClose?.()
    resetSearch()
  }

  const select = (asset: Asset) => {
    onSelect(asset)
    close()
  }

  const setTypeFilterOption = (val: string) => {
    setTypeFilter(val as AssetFilterOptionType)
  }

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
