import { useMemo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetSelectProps } from 'components/AssetSelect/types'

export function useAssetSelect(props: AssetSelectProps) {
  const { assets, onSelect, onClose } = props
  const [search, setSearch] = useState('')
  const filteredAssets = useMemo(() => {
    if (!search) {
      return assets
    }

    return assets.filter(({ asset }) =>
      asset.symbol.toLocaleLowerCase().includes(search.toLowerCase()),
    )
  }, [assets, search])

  const resetSearch = () => setSearch('')

  const close = () => {
    onClose?.()
    resetSearch()
  }

  const select = (asset: Asset) => {
    onSelect(asset)
    close()
  }

  return { search, setSearch, filteredAssets, select, close }
}
