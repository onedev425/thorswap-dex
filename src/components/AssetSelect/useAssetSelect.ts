import { useCallback, useMemo, useState } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetFilterOptionType } from 'components/AssetSelect/assetTypes'
import { AssetSelectProps } from 'components/AssetSelect/types'

import { useAssets } from 'store/assets/hooks'
import { useAppSelector } from 'store/store'

export function useAssetSelect({
  assets = [],
  onSelect,
  onClose,
}: Pick<AssetSelectProps, 'assets' | 'onClose' | 'onSelect'>) {
  const disabledTokenLists = useAppSelector(
    ({ assets }) => assets.disabledTokenLists,
  )
  const [typeFilter, setTypeFilter] = useState<AssetFilterOptionType>('all')

  const { toggleTokenList } = useAssets()

  // const featuredAssets = useMemo(
  //   () =>
  //     featured
  //       .map((ticker) => Asset.fromAssetString(ticker))
  //       .filter(Boolean) as Asset[],
  //   [featured],
  // )

  const filteredAssets = useMemo(
    () =>
      typeFilter === 'all'
        ? assets
        : assets.filter(
            ({ asset: { type } }) => type.toLowerCase() === typeFilter,
          ),
    [assets, typeFilter],
  )

  const close = useCallback(() => {
    onClose?.()
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
    close,
    disabledTokenLists,
    filteredAssets,
    select,
    setTypeFilterOption,
    toggleTokenList,
    typeFilter,
  }
}
