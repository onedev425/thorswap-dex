import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import classNames from "classnames";
import type { AssetSelectProps } from "components/AssetSelect/types";
import { useAssetSelect } from "components/AssetSelect/useAssetSelect";
import { Box, Icon, Tooltip } from "components/Atomic";
import { genericBgClasses } from "components/constants";
import { useCallback } from "react";
import { t } from "services/i18n";
import { EarnAssetSelectItem } from "views/Earn/EarnAssetSelectItem";

export const EarnAssetSelectList = ({
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
      setTimeout(() => setQuery?.(""), 500);
    },
    [select, setQuery],
  );

  return (
    <Box
      col
      className={classNames(
        "rounded-box-lg justify-center items-start w-2/5 py-5 px-6",
        genericBgClasses.secondary,
      )}
      flex={1}
    >
      <Box className="w-full -mt-2 mb-2 pr-3.5" flex={1} justify="end">
        <Tooltip content={t("views.savings.aprTooltip")} place="bottom">
          <Icon className="ml-1" color="primaryBtn" name="infoCircle" size={24} />
        </Tooltip>
      </Box>

      {filteredAssets.length ? (
        <Box className="!overflow-x-clip flex-col overflow-y-auto gap-1.5 w-full h-full">
          {filteredAssets.map((item) => (
            <EarnAssetSelectItem
              {...item}
              isSelected={selectedAsset?.eqAsset(item.asset)}
              key={item.asset.toString()}
              select={handleSelect}
            />
          ))}
        </Box>
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
  );
};
