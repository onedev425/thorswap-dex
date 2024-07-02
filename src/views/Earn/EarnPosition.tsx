import { Flex, Text } from "@chakra-ui/react";
import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import classNames from "classnames";
import { AssetIcon } from "components/AssetIcon";
import { Box, Button } from "components/Atomic";
import { HighlightCard } from "components/HighlightCard";
import type { InfoRowConfig } from "components/InfoRow/types";
import { InfoTable } from "components/InfoTable";
import { InfoWithTooltip } from "components/InfoWithTooltip";
import { useCallback, useMemo } from "react";
import { t } from "services/i18n";
import { zeroAmount } from "types/app";
import type { SaverPosition } from "views/Earn/types";

type Props = {
  position: SaverPosition;
  withdraw: (asset: AssetValue) => void;
  deposit: (asset: AssetValue) => void;
  assetPriceUSD: number;
};

export const EarnPosition = ({ assetPriceUSD, position, withdraw, deposit }: Props) => {
  const amountUsd = useCallback(
    (amount: SwapKitNumber) => `$${(assetPriceUSD * amount.getValue("number")).toFixed(2)}`,
    [assetPriceUSD],
  );

  const infoFields: InfoRowConfig[] = useMemo(
    () => [
      {
        label: "Amount Deposited",
        value: (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.depositAmount)}
            value={`${position.depositAmount.toSignificant(6)} ${position.asset.ticker}`}
          />
        ),
      },
      {
        label: "Amount Redeemable",
        value: (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.amount)}
            value={`${position?.amount?.toSignificant(6)} ${position.asset.ticker}`}
          />
        ),
      },
      {
        label: "Total Earned",
        value: (
          <InfoWithTooltip
            icon="usdCircle"
            tooltip={amountUsd(position.earnedAmount || zeroAmount)}
            value={`${position?.earnedAmount?.toSignificant(6)} ${position.asset.ticker}`}
          />
        ),
      },
    ],
    [amountUsd, position],
  );

  return (
    <Box col justifyCenter className="self-stretch" key={position.asset.toString()}>
      <HighlightCard className="!rounded-2xl pt-2 !pb-0 !gap-0" type="primary">
        <Box alignCenter className="cursor-pointer" justify="between">
          <Box alignCenter flex={1} justify="between">
            <Box center>
              <Box col>
                <AssetIcon asset={position.asset} size={32} />
              </Box>

              <Text className={classNames("mx-1 md:mx-3 !transition-all")} fontWeight="semibold">
                {position.asset.ticker}
              </Text>
            </Box>

            <Flex>
              <Text fontWeight="bold">
                {position.amount?.toSignificant(6)} {position.asset.ticker}
              </Text>
              <Text>&nbsp;</Text>
              <Text fontWeight="light">{`(${amountUsd(position.amount)})`}</Text>
            </Flex>
          </Box>
        </Box>

        <Box className="gap-2">
          <InfoTable horizontalInset className="my-3" items={infoFields} size="sm" />

          <Box col justifyCenter className="gap-1">
            <Button
              stretch
              className="!h-[32px]"
              onClick={() => deposit(position.asset)}
              variant="primary"
            >
              {t("views.liquidity.addButton")}
            </Button>

            <Button
              stretch
              className="md:min-w-[100px] !h-[32px]"
              onClick={() => withdraw(position.asset)}
              variant="outlineSecondary"
            >
              {t("common.withdraw")}
            </Button>
          </Box>
        </Box>
      </HighlightCard>
    </Box>
  );
};
