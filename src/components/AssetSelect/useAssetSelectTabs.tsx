import { useMemo } from 'react'

import { Asset } from '@thorswap-lib/multichain-sdk'

import { AssetsPanel } from 'components/AssetSelect/AssetsPanel'
import { TabsConfig } from 'components/Atomic/Tabs'

import { useAssets } from 'store/assets/hooks'

import { t } from 'services/i18n'

import { AssetSelectType } from './types'

export const useAssetSelectTabs = (
  common: AssetSelectType[],
  onSelect: (val: Asset) => void,
) => {
  const { featured, frequent } = useAssets()
  const commonAssets = common.map((a) => a.asset)
  const featuredAssets = featured
    .map((ticker) => Asset.fromAssetString(ticker))
    .filter(Boolean) as Asset[]

  const frequentAssets = frequent
    .map((ticker) => Asset.fromAssetString(ticker))
    .filter(Boolean) as Asset[]

  const tabs: TabsConfig = useMemo(
    () => [
      {
        label: t('views.swap.tabsFrequent'),
        panel: (
          <AssetsPanel
            assets={frequentAssets}
            onSelect={onSelect}
            emptyTitle={t('views.swap.emptyFrequent')}
          />
        ),
      },
      {
        label: t('views.swap.tabsFeatured'),
        panel: (
          <AssetsPanel
            assets={featuredAssets}
            onSelect={onSelect}
            emptyTitle={t('views.swap.emptyFrequent')}
          />
        ),
      },
      {
        label: t('views.swap.tabsCommon'),
        panel: <AssetsPanel assets={commonAssets} onSelect={onSelect} />,
      },
    ],
    [commonAssets, featuredAssets, frequentAssets, onSelect],
  )

  return tabs
}
