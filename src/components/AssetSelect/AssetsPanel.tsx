import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import { AssetButton } from "components/AssetSelect/AssetButton";
import { Box } from "components/Atomic";

type Props = {
  assets: AssetValue[];
  onSelect: (val: AssetValue) => void;
  emptyTitle?: string;
};

export const AssetsPanel = ({ assets, emptyTitle, onSelect }: Props) => {
  return (
    <Box center className="flex-1 flex-wrap gap-2 pt-2">
      {!assets.length && emptyTitle && (
        <Box center className="h-[40px] flex-1">
          <Text>{emptyTitle}</Text>
        </Box>
      )}
      {assets.map((item) => (
        <Box key={item.symbol}>
          <AssetButton
            asset={item}
            className="bg-opacity-70 dark:bg-opacity-70"
            onClick={() => onSelect(item)}
            size="sm"
          />
        </Box>
      ))}
    </Box>
  );
};
