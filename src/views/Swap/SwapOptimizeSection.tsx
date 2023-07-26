import { Card, Collapse, Flex, Text } from '@chakra-ui/react';
import { Amount, AssetEntity } from '@thorswap-lib/swapkit-core';
import { Icon, Tooltip } from 'components/Atomic';
import { RouteWithApproveType } from 'components/SwapRouter/types';
import { formatDuration } from 'components/TransactionTracker/helpers';
import { useFormatPrice } from 'helpers/formatPrice';
import { useMemo } from 'react';
import { t } from 'services/i18n';

type Props = {
  streamSwap: boolean;
  toggleStreamSwap: (enabled: boolean) => void;
  canStreamSwap: boolean;
  route: RouteWithApproveType | undefined;
  outputAsset: AssetEntity | undefined;
};

export const SwapOptimizeSection = ({
  streamSwap,
  toggleStreamSwap,
  canStreamSwap,
  route,
  outputAsset,
}: Props) => {
  const estimatedTime = route?.estimatedTime ? route.estimatedTime * 1000 : 0;
  const estimatedTimeStreamingSwap = route?.streamingSwap?.estimatedTime
    ? route.streamingSwap.estimatedTime * 1000
    : 0;
  const timeDiff = estimatedTimeStreamingSwap ? estimatedTimeStreamingSwap - estimatedTime : 0;
  const priceUSDDiff = route?.streamingSwap?.expectedOutputUSD
    ? Number(route.streamingSwap.expectedOutputUSD) - Number(route.expectedOutputUSD)
    : 0;

  const outputAmount: Amount = useMemo(
    () => Amount.fromAssetAmount(route?.expectedOutput || '0', outputAsset?.decimal || 0),
    [outputAsset?.decimal, route?.expectedOutput],
  );

  const outputAmountStreamingSwap: Amount = useMemo(
    () =>
      Amount.fromAssetAmount(
        route?.streamingSwap?.expectedOutput || '0',
        outputAsset?.decimal || 0,
      ),
    [outputAsset?.decimal, route?.streamingSwap?.expectedOutput],
  );

  const formatPrice = useFormatPrice();

  return (
    <Flex animateOpacity as={Collapse} in={canStreamSwap} w="100%">
      <Card gap={2} p={3} sx={{ w: 'full', borderRadius: 16 }} variant="filledContainerTertiary">
        <Flex>
          <Text color="textSecondary" fontWeight="semibold" ml={2} textStyle="caption">
            {t('views.swap.streamingSwapAvailable')}
          </Text>

          <Tooltip content="Optimization tooltip" place="bottom">
            <Icon className="ml-1" color="secondary" name="infoCircle" size={18} />
          </Tooltip>
        </Flex>

        <Flex gap={1}>
          <Card
            borderColor={!streamSwap ? 'brand.alpha.btnPrimary' : undefined}
            flex={1}
            onClick={() => toggleStreamSwap(false)}
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
                    {outputAmount.toSignificant(6)} {outputAsset?.ticker || ''}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Card>

          <Card
            borderColor={streamSwap ? 'brand.btnPrimary' : undefined}
            flex={1}
            onClick={() => toggleStreamSwap(true)}
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
                      {outputAmountStreamingSwap.toSignificant(6)} {outputAsset?.symbol || ''}
                    </Text>
                    <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
                      (+{formatPrice(priceUSDDiff)})
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Flex>
      </Card>
    </Flex>
  );
};
