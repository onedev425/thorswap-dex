import {
  Badge,
  chakra,
  CircularProgress,
  Flex,
  Link,
  shouldForwardProp,
  Text,
} from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { AssetIcon } from 'components/AssetIcon';
import { FallbackIcon } from 'components/AssetIcon/FallbackIcon';
import { Button, Icon, Tooltip } from 'components/Atomic';
import { getSimpleTxStatus } from 'components/TransactionManager/helpers';
import { TxLegProvider } from 'components/TransactionTracker/components/TxLegProvider';
import { TxLegTimer } from 'components/TransactionTracker/components/TxLegTimer';
import { getTxState, getTxStatusColor } from 'components/TransactionTracker/helpers';
import { isValidMotionProp, motion } from 'framer-motion';
import { getChainIdentifier } from 'helpers/chains';
import { getTickerFromIdentifier, tokenLogoURL } from 'helpers/logoURL';
import { useTxUrl } from 'hooks/useTxUrl';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import {
  TransactionStatus,
  TransactionType,
  TxStatus,
  TxTrackerLeg,
} from 'store/transactions/types';

type Props = {
  leg: TxTrackerLeg;
  isLast: boolean;
  index: number;
  currentLegIndex: number;
  txStatus?: TxStatus;
  legTimeLeft?: number | null;
};

const AnimatedBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
});

const getLabelForType = ({
  type,
  fromAsset,
  toAsset,
  provider,
}: {
  type?: TransactionType;
  fromAsset: string;
  toAsset: string;
  provider?: string;
}) => {
  if (!type) return;
  if (type.includes('SWAP'))
    return `${t(`txManager.txBadge.swap`, { fromAsset, toAsset })}${
      provider ? ` (${provider})` : ''
    }`;
  if (type.includes(TransactionType.TRANSFER_FROM_TC))
    return t(`txManager.txBadge.fromTCRouter`, { asset: fromAsset });
  if (type.includes(TransactionType.TRANSFER_TO_TC))
    return t(`txManager.txBadge.toTCRouter`, { asset: fromAsset });

  return t(`txManager.txBadge.transfer`, { asset: fromAsset });
};

const colorSchemeForChain = {
  [Chain.Avalanche]: 'red',
  [Chain.Binance]: 'yellow',
  [Chain.BinanceSmartChain]: 'yellow',
  [Chain.Bitcoin]: 'orange',
  [Chain.BitcoinCash]: 'greenLight',
  [Chain.Cosmos]: 'cyan',
  [Chain.Doge]: 'yellow',
  [Chain.Ethereum]: 'purple',
  [Chain.Litecoin]: 'blue',
  [Chain.THORChain]: 'green',
};

export const TxLegPreview = ({
  leg,
  isLast,
  index,
  currentLegIndex,
  txStatus,
  legTimeLeft,
}: Props) => {
  const { finished: isTxFinished } = getTxState(txStatus);

  const inAssetIdentifier = leg.fromAsset;
  const outAssetIdentifier = leg.toAsset;
  const transactionUrl = useTxUrl({ txHash: leg?.hash || '', chain: leg.chain });
  const fromAssetTicker = getTickerFromIdentifier(inAssetIdentifier || '') || '??';
  const toAssetTicker = getTickerFromIdentifier(outAssetIdentifier || '') || '??';

  const isTransfer = !leg.provider && leg.fromAsset === leg.toAsset;

  const status = useMemo(() => {
    if (!isTxFinished && currentLegIndex === index) {
      return 'pending';
    }

    if (leg.status === 'pending' && txStatus === TxStatus.ERROR) {
      return 'error';
    }

    if (currentLegIndex > -1 && currentLegIndex < index) {
      return 'notStarted';
    }

    return leg.status ? getSimpleTxStatus(leg.status) : 'unknown';
  }, [currentLegIndex, index, leg.status, isTxFinished, txStatus]);

  const { badgeLabel, badgeColorScheme } = useMemo(
    () => ({
      badgeLabel: leg.txnType
        ? t(
            `txManager.txBadge.${getLabelForType({
              fromAsset: fromAssetTicker,
              toAsset: toAssetTicker,
              type: leg.txnType,
              provider: leg.provider,
            })}`,
          )
        : undefined,
      badgeColorScheme: colorSchemeForChain[leg.chain],
    }),
    [fromAssetTicker, leg.chain, leg.provider, leg.txnType, toAssetTicker],
  );

  return (
    <Flex gap={2} key={leg.hash}>
      <Flex align="center" direction="column" gap={1}>
        <Flex
          borderRadius={4}
          flexDirection="column"
          gap={1.5}
          maxW="130px"
          minW="110px"
          opacity={status === null ? 0.6 : 1}
          overflow="hidden"
          pb={2}
          position="relative"
          pt={6}
          px={4}
          w="full"
        >
          {status === 'pending' ? (
            <AnimatedBox
              animate={{
                opacity: [0.2, 0.05, 0.2],
              }}
              bg={getTxStatusColor(status)}
              bottom={0}
              left={0}
              position="absolute"
              right={0}
              sx={{ pointerEvents: 'none' }}
              top={0}
              //@ts-ignore
              transition={{
                duration: 2.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
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

          <Flex position="absolute" right={2} top={2}>
            {getTxIcon(status)}
          </Flex>

          <Flex left={2} position="absolute" top={2}>
            <Flex alignSelf="stretch">
              <TxLegTimer isTxFinished={isTxFinished} leg={leg} timeLeft={legTimeLeft} />
            </Flex>
          </Flex>

          <Flex align="center" justify="center" opacity={0.8}>
            <Tooltip content={badgeLabel}>
              <Badge colorScheme={badgeColorScheme} fontSize="10" variant="outline">
                {isTransfer ? t('txManager.transfer') : t('txManager.swap')}
              </Badge>
            </Tooltip>
          </Flex>

          <Flex gap={2} justify="center" mt={1}>
            <Flex align="center" direction="column" gap={1}>
              <AssetIcon
                logoURI={`${leg.fromAssetImage}` || '??'}
                size={36}
                ticker={fromAssetTicker}
              />
            </Flex>

            {!isTransfer && (
              <>
                <Flex alignItems="center">
                  <Text textAlign="center" textStyle="subtitle2">
                    →
                  </Text>
                </Flex>

                <Flex align="center" direction="column" gap={1}>
                  <AssetIcon
                    logoURI={`${leg.toAssetImage}` || '??'}
                    size={36}
                    ticker={toAssetTicker}
                  />
                </Flex>
              </>
            )}
          </Flex>

          <Flex gap={2} justify={isTransfer ? 'center' : 'space-between'} mt={1}>
            <Flex align="center" direction="column">
              {leg.fromAmount ? (
                <Text fontSize="10px" lineHeight="12px" textStyle="caption-xs">
                  {Amount.fromAssetAmount(leg.fromAmount.replace(',', ''), 6).toSignificant(3)}
                </Text>
              ) : (
                <Icon spin className="self-center" name="loader" size={12} />
              )}

              <Text fontSize="10px" lineHeight="12px">
                {fromAssetTicker}
              </Text>
            </Flex>

            {!isTransfer && (
              <Flex align="center" direction="column">
                {leg.toAmount || status === 'refund' ? (
                  <Text fontSize="10px" lineHeight="12px" textStyle="caption-xs">
                    {Amount.fromAssetAmount(
                      (leg.toAmount || '0').replace(',', ''),
                      6,
                    ).toSignificant(3)}
                  </Text>
                ) : (
                  <Icon spin name="loader" size={14} />
                )}

                <Text fontSize="10px" lineHeight="12px">
                  {toAssetTicker}
                </Text>
              </Flex>
            )}
          </Flex>

          <Flex align="center" direction="row" gap={1} justify="center" mb={1} mt={2}>
            <Text fontWeight="light" textAlign="center" textStyle="caption-xs">
              {leg.chain || 'unknown'}
            </Text>

            {leg && (
              <Flex>
                {leg.chain ? (
                  <AssetIcon
                    logoURI={tokenLogoURL({
                      identifier: getChainIdentifier(leg.chain),
                    })}
                    size={22}
                    ticker={leg.chain}
                  />
                ) : (
                  <FallbackIcon
                    icon={<Icon name="hourglass" size={18} />}
                    size={22}
                    ticker={leg.hash || 'unknown'}
                  />
                )}
              </Flex>
            )}
          </Flex>
        </Flex>

        <Link href={transactionUrl} target="_blank" w="full">
          <Button
            rightIcon={<Icon name="external" size={16} />}
            size="xs"
            sx={{ w: 'full' }}
            variant="borderlessTint"
          >
            View tx
          </Button>
        </Link>
      </Flex>

      {!isLast && <TxLegProvider isTransfer={isTransfer} leg={leg} />}
    </Flex>
  );
};

const getTxIcon = (status: TransactionStatus | null) => {
  switch (status) {
    case 'mined':
      return <Icon color="green" name="checkmark" size={18} />;
    case 'error':
      return <Icon color="red" name="close" size={18} />;
    case 'notStarted':
      return <Icon name="hourglass" size={16} />;
    case 'pending':
      return (
        <CircularProgress
          isIndeterminate
          color="brand.btnPrimary"
          size="18px"
          thickness="5px"
          trackColor="transaprent"
        />
      );
    case 'refund':
      return <Icon color="yellow" name="revert" size={18} />;
    default:
      return <Icon name="question" size={18} />;
  }
};
