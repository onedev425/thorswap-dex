import { Flex, Text } from "@chakra-ui/react";
import type { AssetValue, SwapKitNumber } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { Box, Checkbox, Icon, Link } from "components/Atomic";
import { InfoRow } from "components/InfoRow";
import { InfoTip } from "components/InfoTip";
import { ConfirmModal } from "components/Modals/ConfirmModal";
import { useMemo, useState } from "react";
import { t } from "services/i18n";
import { HIGH_LENDING_SLIPPAGE } from "views/Lending/constants";

type Props = {
  asset: AssetValue;
  amount: SwapKitNumber;
  onClose: () => void;
  isOpened: boolean;
  onConfirm: (expectedAmount: string) => void;
  estimatedTime?: number;
  expectedOutputAmount?: SwapKitNumber;
  expectedDebtInfo?: string;
  collateralAmount: SwapKitNumber;
  collateralAsset: AssetValue;
  networkFee?: SwapKitNumber;
  slippagePercent: number;
};

const LENDING_DOCS = "https://twitter.com/THORChain/status/1693423215580958884";

export const BorrowConfirmModal = ({
  isOpened,
  onClose,
  onConfirm,
  asset,
  amount,
  estimatedTime,
  expectedOutputAmount,
  collateralAmount,
  collateralAsset,
  networkFee,
  expectedDebtInfo,
  slippagePercent,
}: Props) => {
  const [slippageAck, setSlippageAck] = useState(false);
  const needSlippageAck = slippagePercent > HIGH_LENDING_SLIPPAGE;

  const timeLabel = useMemo(() => {
    if (!estimatedTime) return undefined;
    const minutes = Math.floor(estimatedTime / 60);
    const hours = Math.floor(minutes / 60);
    const hoursString = hours > 0 ? `${hours}h ` : "";
    const minutesString = minutes > 0 ? `${minutes % 60}m ` : "";
    const secondsString = estimatedTime % 60 > 0 ? ` ${estimatedTime % 60}s` : "";

    return `${hoursString}${minutesString}${secondsString}`;
  }, [estimatedTime]);

  return (
    <ConfirmModal
      buttonDisabled={needSlippageAck && !slippageAck}
      inputAssets={[asset]}
      isOpened={isOpened}
      onClose={onClose}
      onConfirm={() => onConfirm(expectedOutputAmount?.toSignificant(6) || "0")}
    >
      <Box col className="mb-5">
        <InfoRow
          label={
            <Flex align="center" alignContent="center" gap={1}>
              <Text color="textSecondary" mr={1} textStyle="caption" textTransform="capitalize">
                {t("views.views.lending.borrow")}
              </Text>
              <Flex align="center" gap={0.5}>
                <Text textStyle="caption">{asset.ticker}</Text>
                <AssetIcon asset={asset} size={22} />
              </Flex>

              <Flex align="center" gap={0.5}>
                <Text fontWeight="light" mx={1}>
                  for
                </Text>
                <Text textStyle="caption">{collateralAsset.ticker}</Text>
                <AssetIcon asset={collateralAsset} size={22} />
              </Flex>
            </Flex>
          }
          value={undefined}
        />

        <InfoRow
          className="min-h-[38px]"
          label={t("views.lending.collateral")}
          showBorder={false}
          value={
            <Flex align="center" gap={0.5}>
              <Text textStyle="caption">
                {amount.toSignificant(6)} {collateralAsset.ticker}
              </Text>
              <AssetIcon asset={collateralAsset} size={22} />
            </Flex>
          }
        />

        {/* <InfoRow
          className="min-h-[32px]"
          label={t('views.swap.slippage')}
          showBorder={false}
          value={
            <Text textStyle="caption">
              {amount.sub(collateralAmount).toSignificant(6)} {collateralAsset.ticker}
            </Text>
          }
        /> */}

        <InfoRow
          className="min-h-[38px]"
          label={t("views.lending.collateralAfterSlippage")}
          value={
            <Text textStyle="caption">
              {collateralAmount.toSignificant(6)} {collateralAsset.ticker}
            </Text>
          }
        />

        <InfoRow
          className="min-h-[38px]"
          label={t("views.lending.borrow")}
          showBorder={false}
          value={
            <Flex align="center" gap={1}>
              <Text textStyle="caption">
                {expectedOutputAmount ? (
                  `${expectedOutputAmount.toSignificant(6)} ${asset.ticker}`
                ) : networkFee?.gte(amount) ? (
                  t("views.savings.notEnoughForOutboundFee")
                ) : (
                  <Icon spin color="primary" name="loader" size={24} />
                )}
              </Text>
              <AssetIcon asset={asset} size={22} />
            </Flex>
          }
        />

        <InfoRow
          className="min-h-[36px]"
          label={t("views.lending.expectedDebt")}
          showBorder={false}
          value={
            <Flex align="center" gap={1}>
              <Text textStyle="caption">
                {expectedDebtInfo ? (
                  expectedDebtInfo
                ) : (
                  <Icon spin color="primary" name="loader" size={24} />
                )}
              </Text>
            </Flex>
          }
        />

        <InfoRow
          className="min-h-[36px]"
          label={t("common.slippage")}
          value={
            <Text
              color={slippagePercent > HIGH_LENDING_SLIPPAGE ? "brand.red" : "textPrimary"}
              textStyle="caption"
            >
              {slippagePercent.toFixed(1)}%
            </Text>
          }
        />

        <InfoRow
          className="min-h-[38px]"
          label={t("views.wallet.estimatedTime")}
          showBorder={false}
          value={<Text textStyle="caption">{timeLabel || "N/A"}</Text>}
        />

        <InfoTip
          className="mt-4"
          title={
            <>
              <Text mx={2}>
                {t("views.lending.experimentalDisclaimer")}{" "}
                <Link className="text-twitter-blue cursor-pointer" to={LENDING_DOCS}>
                  <Text fontWeight="medium" noOfLines={1} variant="blue">
                    {t("views.lending.riskDisclaimer")} →
                  </Text>
                </Link>
              </Text>
            </>
          }
          type="warn"
        />
      </Box>

      {needSlippageAck && (
        <Checkbox
          className="pt-4 pb-2"
          label={
            <Box alignCenter>
              <Text>{t("views.swap.slippageConfirmationWarning")}</Text>
            </Box>
          }
          onValueChange={setSlippageAck}
          value={slippageAck}
        />
      )}
    </ConfirmModal>
  );
};
