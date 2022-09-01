import { Asset } from '@thorswap-lib/multichain-sdk';
import { AssetsPanel } from 'components/AssetSelect/AssetsPanel';
import { TabsConfig } from 'components/Atomic/Tabs';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { useAppSelector } from 'store/store';

import { AssetSelectType } from './types';

export const useAssetSelectTabs = (common: AssetSelectType[], onSelect: (val: Asset) => void) => {
  const { featured, frequent } = useAppSelector((state) => state.assets);
  const commonAssets = common.map((a) => a.asset);
  const featuredAssets = featured
    .map((ticker) => Asset.fromAssetString(ticker))
    .filter(Boolean) as Asset[];

  const frequentAssets = frequent
    .map((ticker) => Asset.fromAssetString(ticker))
    .filter(Boolean) as Asset[];

  const tabs: TabsConfig = useMemo(
    () => [
      {
        label: t('views.swap.tabsFrequent'),
        panel: (
          <AssetsPanel
            assets={frequentAssets}
            emptyTitle={t('views.swap.emptyFrequent')}
            onSelect={onSelect}
          />
        ),
      },
      {
        label: t('views.swap.tabsFeatured'),
        panel: (
          <AssetsPanel
            assets={featuredAssets}
            emptyTitle={t('views.swap.emptyFrequent')}
            onSelect={onSelect}
          />
        ),
      },
      {
        label: t('views.swap.tabsCommon'),
        panel: <AssetsPanel assets={commonAssets} onSelect={onSelect} />,
      },
    ],
    [commonAssets, featuredAssets, frequentAssets, onSelect],
  );

  return tabs;
};
