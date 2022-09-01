import { Asset } from '@thorswap-lib/multichain-sdk';
import classNames from 'classnames';
import { Box, Icon, Typography } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { Input } from 'components/Input';
import { TabsSelect } from 'components/TabsSelect';
import useWindowSize from 'hooks/useWindowSize';
import { useCallback, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
import { t } from 'services/i18n';

import { AssetSelectItem } from './AssetSelectItem';
import { assetFilterTypes } from './assetTypes';
import { AssetSelectProps } from './types';
import { useAssetSelect } from './useAssetSelect';

const ASSET_ITEM_HEIGHT = 52;

export const AssetSelectList = ({
  assets,
  onSelect,
  onClose,
  isLoading,
  openManageTokenList,
  query,
  setQuery,
}: AssetSelectProps) => {
  const listRef = useRef<List<NotWorth>>(null);
  const { isLgActive } = useWindowSize();
  const { filteredAssets, select, typeFilter, setTypeFilterOption } = useAssetSelect({
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

  const Item = useCallback(
    ({ index, style }: { index: number; style: NotWorth }) => {
      const item = filteredAssets[index];

      if (!item) return null;

      return (
        <AssetSelectItem
          {...item}
          key={`${item.asset.symbol}${item.asset.type}`}
          select={handleSelect}
          style={style}
        />
      );
    },
    [filteredAssets, handleSelect],
  );

  const handleQueryChange = useCallback(
    (event?: React.ChangeEvent<HTMLInputElement>) => {
      const value = event?.target?.value || '';
      listRef?.current?.scrollTo?.(0);
      setQuery?.(value);
    },
    [setQuery],
  );

  return (
    <Box col className={classNames('rounded-box-lg', genericBgClasses.secondary)} flex={1}>
      <Box
        col
        className={classNames(
          'px-4 py-6 pb-3 lg:p-10 lg:pb-6 rounded-t-box-lg gap-2',
          genericBgClasses.secondary,
        )}
      >
        <Input
          autoFocus
          stretch
          border="rounded"
          className="!text-md p-1.5 flex-1 border"
          containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
          onChange={handleQueryChange}
          placeholder={t('components.assetSelect.searchTokenName')}
          suffix={
            query ? <Icon color="secondary" name="close" onClick={() => handleQueryChange()} /> : ''
          }
          value={query}
        />

        <TabsSelect onChange={setTypeFilterOption} tabs={assetFilterTypes} value={typeFilter} />
      </Box>

      <Box
        className={classNames(
          'overflow-x-clip overflow-y-auto bg-light-gray-light dark:bg-dark-asset-select bg-opacity-70 dark:bg-opacity-100',
          'border-solid border-b border-t border-l-0 border-r-0 border-light-border-primary dark:border-dark-gray-light',
          '!-mr-6 lg:!-mr-4',
        )}
        flex={1}
      >
        {filteredAssets.length ? (
          <List
            className="!overflow-x-clip overflow-y-auto"
            height={isLgActive ? 410 : 1000}
            itemCount={filteredAssets.length || 1}
            itemSize={ASSET_ITEM_HEIGHT}
            ref={listRef}
            width="100%"
          >
            {Item}
          </List>
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

      <Box justifyCenter className="pt-4 pb-6">
        <div className="group flex-row flex justify-center" onClick={openManageTokenList}>
          <Icon
            className="cursor-pointer dark:group-hover:text-dark-typo-primary group-hover:text-light-typo-primary"
            color="secondary"
            name="edit"
            size={18}
          />

          <div className="cursor-pointer overflow-hidden transition-all">
            <div className="text-caption uppercase font-semibold px-3 transition-all whitespace-nowrap text-light-typo-gray dark:text-dark-typo-gray dark:group-hover:text-dark-typo-primary group-hover:text-light-typo-primary font-primary">
              {t('components.assetSelect.manageTokenList')}
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};
