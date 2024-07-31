import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import classNames from "classnames";
import type { AssetFilterOptionType } from "components/AssetSelect/assetTypes";
import { assetFilterTypes as assetFilterTypesWithChain } from "components/AssetSelect/assetTypes";
import { useAssetFilterTypes } from "components/AssetSelect/useAssetFilterTypes";
import { Box, Icon } from "components/Atomic";
import { Input } from "components/Input";
import { TabsSelect } from "components/TabsSelect";
import { genericBgClasses } from "components/constants";
import useWindowSize from "hooks/useWindowSize";
import { Fragment, memo, useCallback, useMemo, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { t } from "services/i18n";
import { IS_LEDGER_LIVE } from "settings/config";

import { AssetSelectItem } from "./AssetSelectItem";
import type { AssetSelectProps } from "./types";
import { useAssetSelect } from "./useAssetSelect";

const ASSET_ITEM_HEIGHT = 52;

const SelectList = ({
  assets,
  onSelect,
  onClose,
  isLoading,
  openManageTokenList,
  query,
  setQuery,
  noFilters,
}: AssetSelectProps) => {
  const listRef = useRef<List<NotWorth>>(null);
  const assetFilterTypes = useAssetFilterTypes();
  const { isLgActive } = useWindowSize();
  const { filteredAssets, select, typeFilter, setTypeFilter } = useAssetSelect({
    assets,
    onSelect,
    onClose,
  });

  const handleSelect = useCallback(
    (asset: AssetValue) => {
      select(asset);
      setTimeout(() => setQuery?.(""), 500);
    },
    [select, setQuery],
  );

  const renderItem = useCallback(
    ({ index, style }: { index: number; style: NotWorth }) => {
      const item = filteredAssets[index];

      if (!item) return <Fragment key={`empty-${index}`} />;

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
      const value = event?.target?.value || "";
      listRef?.current?.scrollTo?.(0);
      setQuery?.(value);
    },
    [setQuery],
  );
  const enabledTabs = useMemo(
    () =>
      assetFilterTypesWithChain
        .filter((assetFilter) =>
          assets?.find(
            (asset) => assetFilter.chainAsset && asset.asset.eqAsset(assetFilter.chainAsset),
          ),
        )
        .map((assetFilter) => assetFilter.value)
        .concat(["all"]),
    [assets],
  );

  return (
    <Box col className={classNames("rounded-box-lg", genericBgClasses.secondary)} flex={1}>
      <Box
        col
        className={classNames(
          "px-4 py-6 pb-3 lg:p-6 lg:pb-6 rounded-t-box-lg gap-2",
          genericBgClasses.secondary,
        )}
      >
        <>
          <Input
            autoFocus
            stretch
            border="rounded"
            className="!text-md p-1.5 flex-1 border"
            containerClassName="bg-light-gray-light dark:bg-dark-gray-light !bg-opacity-80"
            onChange={handleQueryChange}
            placeholder={t("components.assetSelect.searchTokenName")}
            suffix={
              query ? (
                <Icon color="secondary" name="close" onClick={() => handleQueryChange()} />
              ) : (
                ""
              )
            }
            value={query}
          />
          {!(noFilters || IS_LEDGER_LIVE) && (
            <TabsSelect
              buttonStyle={{ px: 2 }}
              enabledTabs={enabledTabs}
              onChange={(value) => setTypeFilter(value as AssetFilterOptionType)}
              tabs={assetFilterTypes}
              value={typeFilter}
            />
          )}
        </>
      </Box>

      <Box
        className={classNames(
          "overflow-x-clip overflow-y-auto bg-light-gray-light dark:bg-dark-asset-select bg-opacity-70 dark:bg-opacity-100",
          "border-solid border-b border-t border-l-0 border-r-0 border-light-border-primary dark:border-dark-gray-light",
          "!-mr-6 lg:!-mr-4",
        )}
        flex={1}
      >
        {filteredAssets.length ? (
          <List
            className="!overflow-x-clip overflow-y-auto"
            height={IS_LEDGER_LIVE ? 721 : isLgActive ? 410 : 1000}
            itemCount={filteredAssets.length || 1}
            itemSize={ASSET_ITEM_HEIGHT}
            ref={listRef}
            width="100%"
          >
            {renderItem}
          </List>
        ) : (
          <Box justifyCenter className="pt-4" flex={1}>
            {isLoading ? (
              <Icon spin name="loader" size={24} />
            ) : (
              <Text>{t("components.assetSelect.noResultsFound")}</Text>
            )}
          </Box>
        )}
      </Box>

      <Box justifyCenter className="z-10 pt-4 pb-6">
        {!noFilters && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: nope
          <div className="group flex-row flex justify-center" onClick={openManageTokenList}>
            <Icon
              className="cursor-pointer dark:group-hover:text-dark-typo-primary group-hover:text-light-typo-primary"
              color="secondary"
              name="edit"
              size={18}
            />

            <div className="cursor-pointer overflow-hidden transition-all">
              <div className="text-caption uppercase font-semibold px-3 transition-all whitespace-nowrap text-light-typo-gray dark:text-dark-typo-gray dark:group-hover:text-dark-typo-primary group-hover:text-light-typo-primary font-primary">
                {t("components.assetSelect.manageTokenList")}
              </div>
            </div>
          </div>
        )}
      </Box>
    </Box>
  );
};

export const AssetSelectList = memo(SelectList);
