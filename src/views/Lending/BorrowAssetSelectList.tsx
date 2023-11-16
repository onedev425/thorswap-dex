import { Text } from '@chakra-ui/react';
import type { AssetValue } from '@swapkit/core';
import classNames from 'classnames';
import type { AssetSelectProps } from 'components/AssetSelect/types';
import { useAssetSelect } from 'components/AssetSelect/useAssetSelect';
import { Box, Icon } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { useCallback } from 'react';
import { t } from 'services/i18n';
import { BorrowAssetSelectItem } from 'views/Lending/BorrowAssetSelectItem';

export const BorrowAssetSelectList = ({
  assets,
  onSelect,
  onClose,
  isLoading,
  setQuery,
  selectedAsset,
}: AssetSelectProps & { selectedAsset?: AssetValue }) => {
  const { filteredAssets, select } = useAssetSelect({
    assets,
    onSelect,
    onClose,
  });

  const handleSelect = useCallback(
    (asset: AssetValue) => {
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
      <Text
        fontWeight="medium"
        mb={2}
        ml={2}
        textStyle="caption"
        textTransform="none"
        variant="secondary"
      >
        {t('views.lending.selectCollateralAsset')}
      </Text>

      {filteredAssets.length ? (
        <Box className="!overflow-x-clip flex-col overflow-y-auto gap-1.5 w-full h-full">
          {filteredAssets.map((item) => (
            <BorrowAssetSelectItem
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
            <Text>{t('components.assetSelect.noResultsFound')}</Text>
          )}
        </Box>
      )}
    </Box>
  );
};
