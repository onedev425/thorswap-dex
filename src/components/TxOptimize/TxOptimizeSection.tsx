import { Card, Collapse, Flex, Text } from '@chakra-ui/react';
import type { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Icon, Tooltip } from 'components/Atomic';
import { formatDuration } from 'components/TransactionTracker/helpers';
import { STREAMING_SWAPS_URL } from 'config/constants';
import { useFormatPrice } from 'helpers/formatPrice';
import { useMemo } from 'react';
import { t } from 'services/i18n';
import { navigateToExternalLink } from 'settings/router';
import type { GetTokensQuoteResponse } from 'store/thorswap/types';

type OptimizeQuote = {
  estimatedTime: number;
  expectedOutput: string;
  expectedOutputUSD: string;
  streamingSwap?: GetTokensQuoteResponse['routes'][number]['streamingSwap'];
};

type Props = {
  stream: boolean;
  toggleStream: (enabled: boolean) => void;
  canStream: boolean;
  outputAsset: AssetEntity | undefined;
  quote?: OptimizeQuote;
};

export const TxOptimizeSection = ({
  stream,
  toggleStream,
  canStream,
  outputAsset,
  quote,
}: Props) => {
  const estimatedTime = (quote?.estimatedTime || 0) * 1000;
  const estimatedTimeStreamingSwap = (quote?.streamingSwap?.estimatedTime || 0) * 1000;
  const timeDiff = estimatedTimeStreamingSwap - estimatedTime || 0;
  const priceUSDDiff = quote?.streamingSwap?.expectedOutputUSD
    ? Number(quote.streamingSwap.expectedOutputUSD) - Number(quote.expectedOutputUSD)
    : 0;

  const outputAmount: Amount = useMemo(
    () => Amount.fromAssetAmount(quote?.expectedOutput || '0', outputAsset?.decimal || 0),
    [outputAsset?.decimal, quote?.expectedOutput],
  );

  const outputAmountStreamingSwap: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        quote?.streamingSwap?.expectedOutput || '0',
        outputAsset?.decimal || 0,
      ),
    [outputAsset?.decimal, quote?.streamingSwap?.expectedOutput],
  );

  const formatPrice = useFormatPrice();

  return (
    <Flex animateOpacity as={Collapse} in={canStream} w="100%">
      <Card gap={2} p={3} sx={{ w: 'full', borderRadius: 16 }} variant="filledContainerTertiary">
        <Flex>
          <Text color="textSecondary" fontWeight="semibold" ml={2} textStyle="caption">
            {t('views.swap.priceOptimizationAvailable')}
          </Text>

          <Tooltip
            content={t('views.swap.priceOptimizationInfo')}
            onClick={() => navigateToExternalLink(STREAMING_SWAPS_URL)}
            place="bottom"
          >
            <Icon className="ml-1" color="secondary" name="infoCircle" size={18} />
          </Tooltip>
        </Flex>

        <Flex gap={1}>
          <Card
            borderColor={stream ? 'brand.btnPrimary' : undefined}
            flex={1}
            onClick={() => toggleStream(true)}
            px={2}
            py={1}
            sx={{ cursor: 'pointer' }}
            variant="filledTertiary"
          >
            <Flex direction="column">
              <Flex align="center" gap={1} justify="space-between">
                <Text textStyle="caption-xs">{t('views.swap.priceOptimized')}</Text>
                <Icon color="yellow" name="coin" size={20} />
              </Flex>

              <Flex gap={1}>
                <Flex direction="column" mt={0.5}>
                  <Flex gap={1}>
                    <Text fontWeight="normal" textStyle="caption-xs">
                      {formatDuration(estimatedTimeStreamingSwap, { approx: true })}
                    </Text>
                  </Flex>

                  <Flex gap={1}>
                    <Text textStyle="caption-xs">
                      {outputAmountStreamingSwap.toSignificant(6)} {outputAsset?.name || ''}
                    </Text>
                    <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
                      (+{formatPrice(priceUSDDiff)})
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Card>

          <Card
            borderColor={!stream ? 'brand.alpha.btnPrimary' : undefined}
            flex={1}
            onClick={() => toggleStream(false)}
            px={2}
            py={1}
            sx={{ cursor: 'pointer' }}
            variant="filledTertiary"
          >
            <Flex direction="column">
              <Flex align="center" gap={1} justify="space-between">
                <Text textStyle="caption-xs">{t('views.swap.timeOptimized')}</Text>
                <Icon color="secondaryBtn" name="timer" size={22} />
              </Flex>

              <Flex gap={1}>
                <Flex direction="column" mt={0.5}>
                  <Flex gap={1}>
                    <Text fontWeight="normal" textStyle="caption-xs">
                      {formatDuration(estimatedTime, { approx: true })}
                    </Text>
                    <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
                      ({formatDuration(timeDiff, { approx: true })} faster)
                    </Text>
                  </Flex>

                  <Text textStyle="caption-xs">
                    {outputAmount.toSignificant(6)} {outputAsset?.name || ''}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Card>
    </Flex>
  );
};
