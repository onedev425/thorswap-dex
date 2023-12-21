import {
  Card,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import type { AssetValue, SwapKitNumber } from '@swapkit/core';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { formatDuration } from 'components/TransactionTracker/helpers';
import { STREAMING_SWAPS_URL } from 'config/constants';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { navigateToExternalLink } from 'settings/router';
import type { StreamSwapParams } from 'views/Swap/hooks/useSwapParams';
import { useSwapTimeEstimate } from 'views/Swap/hooks/useSwapTimeEstimate';
import { SwapSlippage } from 'views/Swap/SwapSlippage';

type Props = {
  route?: RouteWithApproveType;
  onSettingsChange?: (value: StreamSwapParams) => void;
  outputAmount: SwapKitNumber;
  outputAsset: AssetValue;
  slippagePercent: number;
  setSlippagePercent: (value: number) => void;
  minReceive: SwapKitNumber;
  defaultInterval: number;
  canStreamSwap: boolean;
  streamingSwapParams: StreamSwapParams | null;
  streamSwap: boolean;
};

type SwapOption = {
  label: string | null;
  subswaps: number;
  interval: number;
  value: number;
};

export const SwapSettings = ({
  route,
  onSettingsChange,
  outputAmount,
  outputAsset,
  slippagePercent,
  setSlippagePercent,
  minReceive,
  defaultInterval,
  canStreamSwap,
  streamingSwapParams,
  streamSwap,
}: Props) => {
  const maxQuantity = route?.streamingSwap?.maxQuantity || 0;
  const maxInterval = route?.streamingSwap?.maxIntervalForMaxQuantity || 10;
  const availableSwaps = useMemo(() => getAvailableOptionsArray({ maxQuantity }), [maxQuantity]);
  const availableIntervals = useMemo(
    () =>
      getAvailableOptionsArray({
        minQuantity: defaultInterval,
        maxQuantity: maxInterval,
        maxSteps: 3,
      }),
    [defaultInterval, maxInterval],
  );

  const [value, setValue] = useState(50);

  const [showTooltip, setShowTooltip] = useState(false);
  const [isChangingValue, setIsChangingValue] = useState(false);
  const [manualSlippagePercent, setManualSlippagePercent] = useState<number | null>(null);
  const estimatedTime = useSwapTimeEstimate({
    streamingSwapParams,
    route,
    streamSwap,
    useMaxTime: value === 100,
  });

  const sliderOptions = useMemo(() => {
    const swapsOptions: SwapOption[] = availableSwaps.map((v, i) => ({
      label: null,
      subswaps: v,
      interval: defaultInterval,
      value: Math.floor((50 / availableSwaps.length) * (i + 1)),
    }));

    swapsOptions.unshift({
      label: `Streaming swap turned off`,
      subswaps: 0,
      interval: 0,
      value: 0,
    });

    const intervalOptions = availableIntervals.map((v, i) => ({
      label: null,
      subswaps: maxQuantity,
      interval: v,
      value: Math.floor(50 + (50 / availableIntervals.length) * (i + 1)),
    }));

    return [...swapsOptions, ...intervalOptions];
  }, [availableIntervals, availableSwaps, defaultInterval, maxQuantity]);

  const values = sliderOptions.map((v) => v.value);

  const selectedOption = useMemo(
    () => sliderOptions.find((o) => value === o.value),
    [sliderOptions, value],
  );

  const onChangeSlippage = useCallback(
    (val: number) => {
      setManualSlippagePercent(val);
      setSlippagePercent(val);
    },
    [setSlippagePercent],
  );

  const onChange = (val: number) => {
    // find closest number from values array

    const closest = values.reduce((prev, curr) => {
      return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
    }, 0);

    setValue(closest);
    if (
      closest > 50 &&
      (manualSlippagePercent === null || slippagePercent === manualSlippagePercent)
    ) {
      setSlippagePercent(0);
      setManualSlippagePercent(slippagePercent);
    }

    if (
      closest <= 50 &&
      slippagePercent === 0 &&
      manualSlippagePercent &&
      manualSlippagePercent > 0
    ) {
      setSlippagePercent(manualSlippagePercent);
    }
  };

  useEffect(() => {
    setValue(50);
  }, [canStreamSwap, route?.path]);

  useEffect(() => {
    if (selectedOption) {
      onSettingsChange?.({ interval: selectedOption.interval, subswaps: selectedOption.subswaps });
    }
  }, [onSettingsChange, selectedOption]);

  if (!route) {
    return null;
  }

  return (
    <Flex w="100%">
      <Card gap={1} p={3} sx={{ w: 'full', borderRadius: 16 }} variant="filledContainerTertiary">
        {canStreamSwap && (
          <>
            <Flex pb={1}>
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

            <Flex
              flex={1}
              gap={1}
              mt={1}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Flex direction="column" w="100%">
                <Flex gap={2.5} mx={4}>
                  {/* <Icon color="secondaryBtn" name="timer" size={22} /> */}
                  <Slider
                    onChange={(val) => onChange(val)}
                    onChangeEnd={() => setIsChangingValue(false)}
                    onChangeStart={() => setIsChangingValue(true)}
                    size="lg"
                    value={value}
                  >
                    <SliderTrack bg="textSecondary" boxSize={2}>
                      <SliderFilledTrack
                        bg={value > 50 ? 'brand.yellow' : 'brand.btnSecondary'}
                        boxSize={2}
                        width="50%"
                      />
                    </SliderTrack>
                    <ChakraTooltip
                      hasArrow
                      bg="bgPrimary"
                      isOpen={showTooltip || isChangingValue}
                      label={
                        <Stack p={1}>
                          {selectedOption?.label ? (
                            <Text textStyle="caption-xs">{selectedOption?.label}</Text>
                          ) : (
                            <>
                              <Flex>
                                <Text textStyle="caption-xs" variant="secondary">
                                  Number of subswaps: &nbsp;
                                </Text>
                                <Text textStyle="caption-xs">{selectedOption?.subswaps}</Text>
                              </Flex>

                              <Flex>
                                <Text textStyle="caption-xs" variant="secondary">
                                  Interval: &nbsp;
                                </Text>
                                <Text textStyle="caption-xs">
                                  {selectedOption?.interval} blocks
                                </Text>
                              </Flex>
                            </>
                          )}
                        </Stack>
                      }
                      placement="top"
                    >
                      <SliderThumb boxSize={4} />
                    </ChakraTooltip>
                    <Flex
                      sx={{
                        w: 3,
                        h: 3,
                        borderRadius: '50%',
                        bg: value > 50 ? 'brand.yellow' : 'brand.btnSecondary',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: '-8px',
                      }}
                    />

                    <Flex
                      sx={{
                        w: 4,
                        h: 4,
                        borderRadius: '50%',
                        bg: value > 50 ? 'brand.yellow' : 'textSecondary',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        left: 'calc(50% - 7px)',
                      }}
                    />

                    <Flex
                      sx={{
                        w: 3,
                        h: 3,
                        borderRadius: '50%',
                        backgroundColor: 'textSecondary',
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: '-8px',
                      }}
                    />
                  </Slider>
                  {/* <Icon color="yellow" name="coin" size={20} /> */}
                </Flex>

                <Flex flex={1} justify="space-between" mt={1}>
                  <Flex>
                    <Button
                      onClick={() => onChange(0)}
                      size="xs"
                      sx={{ px: 2 }}
                      variant="borderlessPrimary"
                    >
                      {t('views.swap.fastest')}
                    </Button>
                  </Flex>
                  <Flex>
                    <Button onClick={() => onChange(50)} size="xs" variant="borderlessPrimary">
                      {t('views.swap.optimal')}
                    </Button>
                  </Flex>
                  <Flex>
                    <Button
                      onClick={() => onChange(100)}
                      size="xs"
                      sx={{ px: 2 }}
                      variant="borderlessPrimary"
                    >
                      {t('views.swap.slowest')}
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}

        <SwapSlippage
          outputAmount={outputAmount}
          outputAsset={outputAsset}
          route={route}
          setSlippagePercent={onChangeSlippage}
          slippagePercent={slippagePercent}
        />

        <Flex flex={1} flexWrap="wrap" ml={2}>
          <Flex direction="column" flex={1}>
            <Text color="textSecondary" fontWeight="semibold" textStyle="caption-xs">
              Minimum:
            </Text>
            <Text
              color={slippagePercent === 0 ? 'brand.yellow' : 'textPrimary'}
              textStyle="caption-xs"
            >
              {slippagePercent === 0
                ? 'No protection'
                : `${minReceive.toCurrency('')} ${outputAsset?.ticker || ''}`}
            </Text>
          </Flex>
          <Flex flex={1} flexDirection="column">
            <Text color="textSecondary" fontWeight="semibold" textStyle="caption-xs">
              Estimated:
            </Text>
            <Flex>
              <Text
                color={value < 50 ? 'brand.yellow' : value > 50 ? 'brand.green' : 'textPrimary'}
                textStyle="caption-xs"
              >
                {outputAmount.toCurrency('')} {outputAsset?.ticker || ''}
              </Text>
            </Flex>
          </Flex>

          <Flex flex={1} flexDirection="column">
            <Text color="textSecondary" fontWeight="semibold" textStyle="caption-xs">
              Time:
            </Text>
            <Flex>
              <Text color={value > 50 ? 'brand.yellow' : 'textPrimary'} textStyle="caption-xs">
                {estimatedTime ? formatDuration(estimatedTime) : 'n/a'}
              </Text>
            </Flex>
          </Flex>
        </Flex>

        {value > 50 && slippagePercent > 0 && (
          <Box row className="w-full my-3 px-2">
            <Icon color="yellow" name="infoCircle" size={26} />{' '}
            <Text className="ml-2" color="brand.yellow" fontWeight="medium" textStyle="caption">
              {t('views.swap.slippageMarketRateWarning')}
            </Text>
          </Box>
        )}
      </Card>
    </Flex>
  );
};

function getAvailableOptionsArray({
  minQuantity = 0,
  maxQuantity,
  maxSteps = 5,
}: {
  minQuantity?: number;
  maxQuantity: number;
  maxSteps?: number;
}) {
  const numElements = Math.min(maxQuantity, maxSteps);

  const step = Math.floor((maxQuantity - minQuantity) / numElements);
  const values = Array.from(
    { length: numElements - 1 },
    (_, i) => i * step + (minQuantity ? step : 1),
  );
  values.push(maxQuantity); // Add maxQuantity as the last value in the array
  return values;
}
