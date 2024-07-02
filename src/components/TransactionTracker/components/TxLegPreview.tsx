import {
  Badge,
  Box,
  CircularProgress,
  Flex,
  Link,
  Text,
  chakra,
  shouldForwardProp,
} from "@chakra-ui/react";
import { TxStatus } from "@swapkit/api";
import { Chain, SwapKitNumber } from "@swapkit/sdk";
import { AssetIcon } from "components/AssetIcon";
import { FallbackIcon } from "components/AssetIcon/FallbackIcon";
import { Button, Icon, Tooltip } from "components/Atomic";
import { getSimpleTxStatus } from "components/TransactionManager/helpers";
import { useTxTrackerDetails } from "components/TransactionTracker/TxTrackerDetailsContext";
import { TxLegProvider } from "components/TransactionTracker/components/TxLegProvider";
import { TxLegTimer } from "components/TransactionTracker/components/TxLegTimer";
import { getTxState, getTxStatusColor } from "components/TransactionTracker/helpers";
import { TrackerTxDisplayType } from "components/TransactionTracker/types";
import { isValidMotionProp, motion } from "framer-motion";
import { getChainIdentifier } from "helpers/chains";
import { getTickerFromIdentifier, tokenLogoURL } from "helpers/logoURL";
import { useTxUrl } from "hooks/useTxUrl";
import { useMemo } from "react";
import { t } from "services/i18n";
import type { TransactionStatus, TxTrackerLeg } from "store/transactions/types";
import { TransactionType } from "store/transactions/types";

type Props = {
  leg: TxTrackerLeg;
  isLast: boolean;
  index: number;
  currentLegIndex?: number;
  txStatus?: TxStatus;
  legTimeLeft?: number | null;
  horizontalView?: boolean;
};

const AnimatedBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const getLabelForType = ({
  type,
  fromAsset,
  toAsset,
  provider,
  index,
  txDisplayType,
}: {
  type?: TransactionType;
  fromAsset: string;
  toAsset: string;
  provider?: string;
  index: number;
  txDisplayType?: TrackerTxDisplayType;
}) => {
  if (txDisplayType === TrackerTxDisplayType.LENDING) {
    if (index === 0) {
      return t("txManager.transferCollateral");
    }

    if (index === 1) {
      return t("txManager.lending");
    }
  }

  if (!type) return;
  if (type.includes("SWAP"))
    return `${t("txManager.txBadge.swap", { fromAsset, toAsset })}${
      provider ? ` (${provider})` : ""
    }`;
  if (type.includes(TransactionType.TRANSFER_FROM_TC))
    return t("txManager.txBadge.fromTCRouter", { asset: fromAsset });
  if (type.includes(TransactionType.TRANSFER_TO_TC))
    return t("txManager.txBadge.toTCRouter", { asset: fromAsset });

  return t("txManager.txBadge.transfer", { asset: fromAsset });
};

const getBadge = ({
  isTransfer,
  txDisplayType,
  index,
}: {
  isTransfer: boolean;
  index: number;
  txDisplayType?: TrackerTxDisplayType;
}) => {
  if (txDisplayType === TrackerTxDisplayType.LENDING) {
    if (index === 0) {
      return t("txManager.collateral");
    }

    if (index === 1) {
      return t("txManager.loan");
    }
  }

  return isTransfer ? t("txManager.transfer") : t("txManager.swap");
};

const colorSchemeForChain = {
  [Chain.Avalanche]: "red",
  [Chain.BinanceSmartChain]: "yellow",
  [Chain.Bitcoin]: "orange",
  [Chain.BitcoinCash]: "greenLight",
  [Chain.Cosmos]: "cyan",
  [Chain.Dogecoin]: "yellow",
  [Chain.Ethereum]: "purple",
  [Chain.Litecoin]: "blue",
  [Chain.Arbitrum]: "blue",
  [Chain.Optimism]: "red",
  [Chain.Polygon]: "purple",
  [Chain.THORChain]: "green",
  [Chain.Maya]: "green",
  [Chain.Kujira]: "red",
  [Chain.Dash]: "blue",
  [Chain.Polkadot]: "red",
  [Chain.Chainflip]: "green",
  [Chain.Radix]: "green",
  [Chain.Solana]: "green",
};

export const TxLegPreview = ({
  leg = {} as TxTrackerLeg,
  isLast,
  index,
  currentLegIndex,
  txStatus,
  legTimeLeft,
  horizontalView,
}: Props) => {
  const { txDetails, txDisplayType } = useTxTrackerDetails();
  const { finished: isTxFinished } = getTxState(txStatus);

  const isRuneLastLeg = isLast && leg.chain === Chain.THORChain;
  const invalidRuneTxHash =
    isRuneLastLeg &&
    leg.hash === "0000000000000000000000000000000000000000000000000000000000000000";

  const inAssetIdentifier = leg.fromAsset;
  const outAssetIdentifier = leg.toAsset;
  const transactionUrl = useTxUrl({
    txHash:
      (invalidRuneTxHash
        ? txDetails?.legs[Math.max(txDetails.legs.length - 2, 0)]?.hash
        : leg?.hash) || "",
    chain: leg.chain,
  });
  const fromAssetTicker = getTickerFromIdentifier(inAssetIdentifier || "") || "??";
  const toAssetTicker = getTickerFromIdentifier(outAssetIdentifier || "") || "??";

  const isTransfer = !leg.provider && leg.fromAsset === leg.toAsset;
  const isStreamming = leg.status === TxStatus.STREAMING;

  const status = useMemo(() => {
    if (typeof currentLegIndex !== "undefined") {
      // logic for v1 tracker
      if (!isTxFinished && currentLegIndex === index) {
        return "pending";
      }

      if (leg.status === "pending" && txStatus === TxStatus.ERROR) {
        return "error";
      }

      if (currentLegIndex > -1 && currentLegIndex < index) {
        return "notStarted";
      }
    }

    return leg.status ? getSimpleTxStatus(leg.status) : "unknown";
  }, [currentLegIndex, index, leg.status, isTxFinished, txStatus]);

  const { badgeLabel, badgeColorScheme } = useMemo(
    () => ({
      badgeLabel: isStreamming
        ? t("txManager.streaming")
        : leg.txnType
          ? getLabelForType({
              fromAsset: fromAssetTicker,
              toAsset: toAssetTicker,
              type: leg.txnType,
              provider: leg.provider,
              index,
              txDisplayType,
            })
          : undefined,
      badgeColorScheme: colorSchemeForChain[leg.chain],
    }),
    [
      fromAssetTicker,
      index,
      isStreamming,
      leg.chain,
      leg.provider,
      leg.txnType,
      toAssetTicker,
      txDisplayType,
    ],
  );

  return (
    <Flex key={leg.hash}>
      <Flex align="start" direction="column" gap={0.5} w="full">
        <Flex
          borderRadius={4}
          flexDirection="column"
          gap={1.5}
          maxW={horizontalView ? "160px" : "none"}
          minW={horizontalView ? "110px" : "none"}
          opacity={status === null ? 0.6 : 1}
          overflow="hidden"
          pb={2}
          position="relative"
          pt={6}
          px={2}
          w="full"
        >
          {status === "pending" ? (
            <AnimatedBox
              animate={{
                opacity: [0.2, 0.05, 0.2],
              }}
              bg={getTxStatusColor(status)}
              bottom={0}
              left={0}
              position="absolute"
              right={0}
              sx={{ pointerEvents: "none" }}
              top={0}
              // @ts-expect-error
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
              }}
            />
          ) : (
            <Flex
              bg={getTxStatusColor(status)}
              bottom={0}
              left={0}
              opacity={0.2}
              pointerEvents="none"
              position="absolute"
              right={0}
              top={0}
            />
          )}

          <Flex position="absolute" right={2} top={horizontalView ? 2 : 1}>
            {getTxIcon(status)}
          </Flex>

          <Flex left={2} position="absolute" top={horizontalView ? 2 : 1}>
            <Flex alignSelf="stretch">
              <TxLegTimer isTxFinished={isTxFinished} leg={leg} timeLeft={legTimeLeft} />
            </Flex>
          </Flex>

          <Flex
            align="center"
            display={horizontalView ? "none" : "flex"}
            gap={1}
            justify="center"
            position="absolute"
            right={8}
            top={1}
          >
            <Text fontWeight="light" textAlign="center" textStyle="caption-xs">
              {leg.chain || "unknown"}
            </Text>

            {leg && (
              <Flex>
                {leg.chain ? (
                  <AssetIcon
                    logoURI={tokenLogoURL({ identifier: getChainIdentifier(leg.chain) })}
                    size={18}
                    ticker={leg.chain}
                  />
                ) : (
                  <FallbackIcon
                    icon={<Icon name="hourglass" size={18} />}
                    size={22}
                    ticker={leg.hash || "unknown"}
                  />
                )}
              </Flex>
            )}
          </Flex>

          <Flex
            display={horizontalView ? "none" : "flex"}
            justify="center"
            left={0}
            opacity={0.8}
            position="absolute"
            top={0}
            w="full"
          >
            <Tooltip content={badgeLabel}>
              <Badge colorScheme={badgeColorScheme} fontSize="10" variant="outline">
                {getBadge({ isTransfer, index, txDisplayType })}
              </Badge>
            </Tooltip>
          </Flex>

          <Flex
            align="center"
            display={horizontalView ? "flex" : "none"}
            justify="center"
            mt={1}
            opacity={0.8}
          >
            <Tooltip content={badgeLabel}>
              <Badge colorScheme={badgeColorScheme} fontSize="10" variant="outline">
                {getBadge({ isTransfer, index, txDisplayType })}
              </Badge>
            </Tooltip>
          </Flex>

          <Flex gap={3} mt={1}>
            <Flex
              align="center"
              direction={horizontalView ? "column-reverse" : "row"}
              flex={4}
              gap={1}
              justifyContent={isTransfer ? "center" : "end"}
            >
              <Flex align="center" direction="column" gap={horizontalView ? 1 : 0}>
                {leg.fromAmount ? (
                  <Text fontSize="10px" lineHeight="12px" textStyle="caption-xs">
                    {new SwapKitNumber(leg.fromAmount).toSignificant(6)}
                  </Text>
                ) : (
                  <Icon spin className="self-center" name="loader" size={12} />
                )}

                <Text fontSize="10px" lineHeight="12px">
                  {fromAssetTicker}
                </Text>
              </Flex>
              <AssetIcon
                logoURI={leg.fromAssetImage || ""}
                size={horizontalView ? 30 : 22}
                ticker={fromAssetTicker}
              />
            </Flex>

            {!isTransfer && (
              <>
                <Flex alignItems="center" flex={1} justify="center">
                  <Text textAlign="center" textStyle="subtitle2">
                    →
                  </Text>
                </Flex>
                <Flex
                  align="center"
                  direction={horizontalView ? "column" : "row"}
                  flex={4}
                  gap={1}
                  justifyContent="start"
                >
                  <AssetIcon
                    logoURI={leg.toAssetImage || ""}
                    size={horizontalView ? 30 : 22}
                    ticker={toAssetTicker}
                  />
                  <Flex align="center" direction="column" gap={horizontalView ? 1 : 0}>
                    {leg.toAmount || status === "refund" ? (
                      <Text fontSize="10px" lineHeight="12px" textStyle="caption-xs">
                        {new SwapKitNumber(leg.toAmount || "0").toSignificant(6)}
                      </Text>
                    ) : (
                      <Icon spin name="loader" size={14} />
                    )}

                    <Text fontSize="10px" lineHeight="12px">
                      {toAssetTicker}
                    </Text>
                  </Flex>
                </Flex>
              </>
            )}
          </Flex>

          <Flex
            align="center"
            direction="row"
            display={horizontalView ? "flex" : "none"}
            gap={1}
            justify="center"
            mb={1}
            mt={2}
          >
            {leg && (
              <Flex align="center" direction="row" justify="center">
                {leg.chain ? (
                  <>
                    <Text fontWeight="light" textAlign="center" textStyle="caption-xs">
                      {leg.chain || "unknown"}
                    </Text>
                    <AssetIcon
                      logoURI={tokenLogoURL({ identifier: getChainIdentifier(leg.chain) })}
                      size={22}
                      ticker={leg.chain}
                    />
                  </>
                ) : null}
              </Flex>
            )}
          </Flex>
        </Flex>

        <Flex justify={horizontalView ? "center" : "end"} minH="28px" position="relative" w="full">
          {transactionUrl && (
            <Link href={transactionUrl} target="_blank" zIndex={1}>
              <Button
                rightIcon={<Icon name="external" size={16} />}
                size="xs"
                sx={{ w: "full" }}
                variant="borderlessTint"
              >
                {t("txManager.viewTx")}
              </Button>
            </Link>
          )}
          {!isLast && (
            <Flex
              align="center"
              display={horizontalView ? "none" : "flex"}
              justify="center"
              position="absolute"
              right={0}
              top={1}
              w="full"
            >
              <Icon name="chevronDown" />
            </Flex>
          )}
        </Flex>
      </Flex>

      <Box display={horizontalView ? "flex" : "none"}>
        {!isLast && (
          <TxLegProvider horizontalView={horizontalView} isTransfer={isTransfer} leg={leg} />
        )}
      </Box>
    </Flex>
  );
};

const getTxIcon = (status: TransactionStatus | null) => {
  switch (status) {
    case "mined":
      return <Icon color="green" name="checkmark" size={18} />;
    case "error":
      return <Icon color="red" name="close" size={18} />;
    case "notStarted":
      return <Icon name="hourglass" size={16} />;
    case "pending":
      return (
        <CircularProgress
          isIndeterminate
          color="brand.btnPrimary"
          size="18px"
          thickness="5px"
          trackColor="transaprent"
        />
      );
    case "refund":
      return <Icon color="yellow" name="revert" size={18} />;
    default:
      return <Icon name="question" size={18} />;
  }
};
