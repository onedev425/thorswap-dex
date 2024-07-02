import { Text } from "@chakra-ui/react";
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
  tabLabel: string;
  estimatedTime?: number;
  expectedOutputAmount?: SwapKitNumber;
  expectedOutputMaxSlippage?: SwapKitNumber;
  expectedDebtInfo?: string;
  collateralAmount?: SwapKitNumber;
  collateralAsset?: AssetValue;
  networkFee?: SwapKitNumber;
  inputAmount?: SwapKitNumber;
  slippagePercent: number;
};

const LENDING_DOCS = "https://twitter.com/THORChain/status/1693423215580958884";

export const LendingConfirmModal = ({
  isOpened,
  onClose,
  onConfirm,
  asset,
  amount,
  tabLabel,
  estimatedTime,
  expectedOutputAmount,
  expectedOutputMaxSlippage,
  collateralAmount,
  collateralAsset,
  networkFee,
  expectedDebtInfo,
  slippagePercent,
  inputAmount,
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

  const txInfos = useMemo(
    () =>
      [
        { label: t("common.action"), value: tabLabel },
        { label: t("common.asset"), value: `${asset.ticker}`, icon: asset },
      ] as { label: string; value: string | React.JSX.Element; icon?: AssetValue }[],
    [asset, tabLabel],
  );

  const repayInfo = useMemo(
    () => [
      { label: t("views.wallet.estimatedTime"), value: timeLabel || "N/A" },
      {
        label: t("views.lending.sendAmount"),
        value: expectedOutputAmount ? (
          `${expectedOutputAmount.toSignificant(6)} ${asset.ticker}`
        ) : networkFee?.gte(amount) ? (
          t("views.savings.notEnoughForOutboundFee")
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
      {
        label: t("views.lending.repayDebt"),
        value: `${inputAmount?.toSignificant(6)} ${asset.ticker}` || "N/A",
      },
      {
        label: t("common.slippage"),
        value: (
          <Text
            color={slippagePercent > HIGH_LENDING_SLIPPAGE ? "brand.red" : "textPrimary"}
            textStyle="caption"
          >
            {slippagePercent.toFixed(1)}%
          </Text>
        ),
      },
    ],
    [
      amount,
      asset.ticker,
      expectedOutputAmount,
      inputAmount,
      networkFee,
      slippagePercent,
      timeLabel,
    ],
  );

  const borrowInfo = useMemo(
    () => [
      {
        label: t("views.lending.collateral"),
        value: `${collateralAsset?.ticker}`,
        icon: collateralAsset,
      },
      { label: t("views.wallet.estimatedTime"), value: timeLabel || "N/A" },
      {
        label: tabLabel,
        value: expectedOutputAmount ? (
          `${expectedOutputAmount.toSignificant(6)} ${asset.ticker}`
        ) : networkFee?.gte(amount) ? (
          t("views.savings.notEnoughForOutboundFee")
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
      {
        label: t("common.minReceived"),
        value: expectedOutputMaxSlippage ? (
          `${expectedOutputMaxSlippage?.toSignificant(6)} ${asset.ticker}`
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
      {
        label: t("views.lending.collateralValue"),
        value:
          collateralAmount && collateralAsset ? (
            `${collateralAmount.toSignificant(6)} ${collateralAsset.ticker}`
          ) : (
            <Icon spin color="primary" name="loader" size={24} />
          ),
      },
      {
        label: t("views.lending.expectedDebt"),
        value: expectedDebtInfo ? (
          expectedDebtInfo
        ) : (
          <Icon spin color="primary" name="loader" size={24} />
        ),
      },
    ],
    [
      amount,
      asset,
      collateralAmount,
      collateralAsset,
      expectedDebtInfo,
      expectedOutputAmount,
      expectedOutputMaxSlippage,
      networkFee,
      tabLabel,
      timeLabel,
    ],
  );

  const infoRows = useMemo(
    () => (expectedDebtInfo ? txInfos.concat(borrowInfo) : txInfos.concat(repayInfo)),
    [borrowInfo, expectedDebtInfo, repayInfo, txInfos],
  );

  return (
    <ConfirmModal
      buttonDisabled={needSlippageAck && !slippageAck}
      inputAssets={[asset]}
      isOpened={isOpened}
      onClose={onClose}
      onConfirm={() => onConfirm(expectedOutputAmount?.toSignificant(6) || "0")}
    >
      <Box col className="mb-5">
        {infoRows.map(({ label, value, icon }) => (
          <InfoRow
            key={label}
            label={label}
            value={
              <Box center className="gap-1">
                <Text textStyle="caption">{value}</Text>
                {icon && <AssetIcon asset={icon} size={22} />}
              </Box>
            }
          />
        ))}

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
      </Box>
    </ConfirmModal>
  );
};
