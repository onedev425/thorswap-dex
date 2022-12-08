import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetSelectProps } from 'components/AssetSelect/types';
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect';
import { Box, Icon, Typography } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { EarnAssetSelectItem } from 'views/Earn/EarnAssetSelectItem';

export const EarnAssetSelectList = ({
  assets,
  onSelect,
  onClose,
  isLoading,
  setQuery,
  selectedAsset,
}: AssetSelectProps & { selectedAsset?: Asset }) => {
  const { filteredAssets, select } = useAssetSelect({
    assets,
    onSelect,
    onClose,
  });

  const handleSelect = useCallback(
    (asset: Asset) => {
      select(asset);
      setTimeout(() => setQuery?.(''), 500);
    },
    [select, setQuery],
  );

  return (
    <Box
      col
      className={classNames(
        'rounded-box-lg justify-center items-start w-2/5 py-5 px-6',
        genericBgClasses.secondary,
      )}
      flex={1}
    >
      {filteredAssets.length ? (
        <Box className="!overflow-x-clip flex-col overflow-y-auto gap-2 w-full h-full">
          {filteredAssets.map((item) => (
            <EarnAssetSelectItem
              {...item}
              isSelected={selectedAsset?.eq(item.asset)}
              key={`${item.asset.symbol}${item.asset.type}`}
              select={handleSelect}
            />
          ))}
        </Box>
      ) : (
        <Box justifyCenter className="pt-4" flex={1}>
          {isLoading ? (
            <Icon spin name="loader" size={24} />
          ) : (
            <Typography>{t('components.assetSelect.noResultsFound')}</Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
