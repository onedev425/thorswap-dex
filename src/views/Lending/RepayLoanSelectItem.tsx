import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box } from "components/Atomic";
import { memo } from "react";

import type { AssetSelectType } from "../../components/AssetSelect/types";

type Props = AssetSelectType & {
  select: (asset: AssetValue) => void;
  isSelected?: boolean;
};

export const RepayLoanSelectItem = memo(
  ({ asset, logoURI, select, isSelected, balance }: Props) => {
    return (
      <Box
        alignCenter
        className={classNames(
          "dark:bg-dark-dark-gray bg-btn-light-tint z-0 lig rounded-3xl p-2 hover:duration-150 transition cursor-pointer  dark:hover:bg-dark-border-primary hover:bg-btn-light-tint-active border border-transparent",
          {
            "brightness-90 dark:brightness-110 dark:!bg-dark-border-primary !bg-btn-light-tint-active border-btn-primary":
              isSelected,
          },
        )}
        onClick={() => select(asset)}
      >
        <Box>
          <AssetIcon asset={asset} logoURI={logoURI} size={34} />
        </Box>
        <Box center className="flex justify-between w-full ml-2 mr-3">
          <Text fontWeight="medium" textStyle="body">
            {asset?.ticker}
          </Text>

          {!!balance && (
            <Text fontWeight="medium" textStyle="caption-xs" variant="secondary">
              {balance.toSignificant(6)}
            </Text>
          )}
        </Box>
      </Box>
    );
  },
);
