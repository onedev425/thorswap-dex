import { Flex, Text } from "@chakra-ui/react";
import { BaseDecimal, SwapKitNumber } from "@swapkit/sdk";
import { Button, Icon } from "components/Atomic";
import { InfoRow } from "components/InfoRow";
import { InfoWithTooltip } from "components/InfoWithTooltip";
import { showSuccessToast } from "components/Toast";
import { useTxTrackerDetails } from "components/TransactionTracker/TxTrackerDetailsContext";
import { TxDetailsStatusInfo } from "components/TransactionTracker/components/TxDetailsStatusInfo";
import { TxStreamingSwapDetails } from "components/TransactionTracker/components/TxStreamingSwapDetails";
import { formatDuration, getTxDuration, getTxState } from "components/TransactionTracker/helpers";
import { TrackerTxDisplayType } from "components/TransactionTracker/types";
import copy from "copy-to-clipboard";
import { getTickerFromIdentifier } from "helpers/logoURL";
import { shortenAddress } from "helpers/shortenAddress";
import { useCounter } from "hooks/useCountdown";
import { useMemo } from "react";
import { t } from "services/i18n";

type Props = {
  isCompleted: boolean;
  totalTimeLeft: number | null;
};

export const TxDetailsInfo = ({ isCompleted, totalTimeLeft }: Props) => {
  const { txDetails, txDisplayType } = useTxTrackerDetails();
  const txCounter = useCounter({
    startTimestamp: isCompleted ? null : txDetails?.legs?.[0]?.startTimestamp,
  });

  const streamingSwapDetails = useMemo(() => {
    if (!txDetails?.isStreamingSwap) return null;

    const legWithDetails = txDetails.legs?.find((leg) => leg.streamingSwapDetails);

    return legWithDetails?.streamingSwapDetails || null;
  }, [txDetails?.isStreamingSwap, txDetails?.legs]);

  const swapLabel = useMemo(() => {
    if (txDisplayType === TrackerTxDisplayType.SWAP) return t("txManager.swap");
    if (txDisplayType === TrackerTxDisplayType.LENDING) return t("txManager.lending");
  }, [txDisplayType]);

  if (!txDetails) return null;

  const { legs, firstTransactionHash, status } = txDetails;
  const { error } = getTxState(status);
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  const duration = getTxDuration(legs);

  const firstLegInfo =
    (!!firstLeg.fromAmount &&
      Number.parseFloat(firstLeg.fromAmount) &&
      `${new SwapKitNumber({
        value: firstLeg.fromAmount,
        decimal: BaseDecimal[firstLeg.chain],
      }).toSignificant(6)} ${getTickerFromIdentifier(firstLeg.fromAsset || "")}`) ||
    "";

  const lastLegInfo =
    (!!lastLeg.toAmount &&
      Number.parseFloat(lastLeg.toAmount) &&
      `${new SwapKitNumber({
        value: lastLeg.toAmount,
        decimal: BaseDecimal[lastLeg.chain],
      }).toSignificant(6)} ${getTickerFromIdentifier(lastLeg.toAsset || "")}`) ||
    "";

  const swapLabelValue = `${firstLegInfo}${lastLegInfo ? ` -> ${lastLegInfo}` : ""}`;
  const txUrl = `${window.location.origin}/tx/${firstTransactionHash}`;

  return (
    <Flex direction="column" w="full">
      {streamingSwapDetails && (
        <TxStreamingSwapDetails streamingSwapDetails={streamingSwapDetails} />
      )}

      <InfoRow
        label={t("views.thorname.status")}
        size="md"
        value={
          <Flex align="center" gap={1} justify="center">
            <TxDetailsStatusInfo totalTimeLeft={totalTimeLeft} txDetails={txDetails} />
          </Flex>
        }
      />

      {swapLabelValue && <InfoRow label={swapLabel} size="md" value={swapLabelValue} />}

      {legs.length > 0 && (!!firstLeg?.startTimestamp || !!lastLeg.endTimestamp) && (
        <InfoRow
          label={null}
          size="md"
          value={
            <Flex flexWrap="wrap" gap={2} justifyContent="space-between" py={1} w="full">
              {!!firstLeg?.startTimestamp && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" fontWeight="medium" textStyle="caption">
                    {t("txManager.started")}:
                  </Text>
                  <Text fontWeight="semibold" textStyle="caption">
                    {new Date(firstLeg?.startTimestamp || "").toLocaleString("default", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </Text>
                </Flex>
              )}
              {isCompleted && !error && !!lastLeg?.endTimestamp && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" fontWeight="medium" textStyle="caption">
                    {t("txManager.completed")}:
                  </Text>
                  <Text fontWeight="semibold" textStyle="caption">
                    {new Date(lastLeg?.endTimestamp || "").toLocaleString("default", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </Text>
                </Flex>
              )}

              {((!!txCounter && !!txCounter.timeSince) || !!duration) && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" fontWeight="medium" textStyle="caption">
                    {t("txManager.duration")}:
                  </Text>
                  <InfoWithTooltip
                    icon="timer"
                    tooltip={t("txManager.totalTimeTooltip")}
                    value={
                      <Text
                        fontWeight="semibold"
                        minW="75px"
                        textStyle="caption-xs"
                        whiteSpace="nowrap"
                      >
                        {formatDuration(txCounter?.timeSince || (duration as number))}
                      </Text>
                    }
                  />
                </Flex>
              )}
            </Flex>
          }
        />
      )}

      <InfoRow
        label={t("txManager.shareTransaction")}
        size="md"
        value={
          <Flex flexWrap="wrap">
            <Button
              className="!px-2 h-auto"
              onClick={() => {
                showSuccessToast(t("txManager.txIdCopied"));
                copy(firstTransactionHash);
              }}
              rightIcon={<Icon color="primaryBtn" name="copy" size={14} />}
              size="xs"
              tooltip={t("txManager.copyTxId")}
              variant="borderlessTint"
            >
              {shortenAddress(firstTransactionHash, 8, 8)}
            </Button>
            <Button
              className="!px-2 h-auto"
              onClick={() => {
                showSuccessToast(t("txManager.txUrlCopied"));
                copy(txUrl);
              }}
              rightIcon={
                <Icon className="-mt-[5px]" color="primaryBtn" name="shareUrl" size={14} />
              }
              size="xs"
              tooltip={`${t("txManager.copyTxUrl")}: ${txUrl}`}
              variant="borderlessTint"
            >
              {t("txManager.shareTxUrl")}
            </Button>
          </Flex>
        }
      />
    </Flex>
  );
};
