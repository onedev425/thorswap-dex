import { Text } from "@chakra-ui/react";
import type { AssetValue } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon/AssetIcon";
import { Box } from "components/Atomic";
import { genericBgClasses } from "components/constants";
import { memo } from "react";

type Props = {
  className?: string;
  assetValue: AssetValue;
  stretch?: boolean;
};

const AmountBox = ({ className, assetValue, stretch }: Props) => {
  const [amount = "-", ticker] = assetValue.toSignificant(6).split(" ");

  return (
    <Box
      alignCenter
      className={classNames(
        "p-1 rounded-full flex-1 w-full self-stretch",
        { "max-w-[150px]": !stretch },
        genericBgClasses.secondary,
        className,
      )}
    >
      <AssetIcon asset={assetValue} />

      <Box col className="ml-3">
        <Text>{amount}</Text>
        <Text fontWeight="normal" variant="secondary">
          {ticker}
        </Text>
      </Box>
    </Box>
  );
};

export const AssetAmountBox = memo(AmountBox);
