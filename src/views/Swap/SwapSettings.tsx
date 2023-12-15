import {
  Card,
  Collapse,
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
import { Button, Icon, Tooltip } from 'components/Atomic';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { STREAMING_SWAPS_URL } from 'config/constants';
import { useFormatPrice } from 'helpers/formatPrice';
import { useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { navigateToExternalLink } from 'settings/router';
import { SwapSlippage } from 'views/Swap/SwapSlippage';
import type { StreamSwapParams } from 'views/Swap/useSwapParams';

type Props = {
  route?: RouteWithApproveType;
  onSettingsChange?: (value: StreamSwapParams) => void;
  outputAmount: SwapKitNumber;
  outputAsset: AssetValue;
  priceOptimization: number;
  slippagePercent: number;
  setSlippagePercent: (value: number) => void;
  minReceive: SwapKitNumber;
};

type SwapOption = {
  label: string | null;
  subswaps: number;
  interval: number;
  value: number;
};

function getAvailableOptionsArrau(maxQuantity: number, maxSteps: number = 5) {
  const numElements = Math.min(maxQuantity, maxSteps);
  const step = Math.floor(maxQuantity / (numElements - 1));
  const values = Array.from({ length: numElements - 1 }, (_, i) => i * step + 1);
  values.push(maxQuantity); // Add maxQuantity as the last value in the array

  return values;
}
export const SwapSettings = ({
  route,
  onSettingsChange,
  outputAmount,
  priceOptimization,
  outputAsset,
  slippagePercent,
  setSlippagePercent,
  minReceive,
}: Props) => {
  const formatPrice = useFormatPrice();

  // defaultInterval should com from pool, but it is not available yet
  // parse memo limit/interval/subswaps
  const defaultInterval = Number(
    route?.calldata?.memoStreamingSwap?.match(/\/([0-9]+)\//)?.[1] || 3,
  );

  const maxQuantity = route?.streamingSwap?.maxQuantity || 0;
  const maxInterval = route?.streamingSwap?.maxIntervalForMaxQuantity || 10;

  const availableSwaps = useMemo(() => getAvailableOptionsArrau(maxQuantity), [maxQuantity]);
  const availableIntervals = useMemo(() => getAvailableOptionsArrau(maxInterval, 3), [maxInterval]);

  const [value, setValue] = useState(50);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isChangingValue, setIsChangingValue] = useState(false);

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

  const onChange = (val: number) => {
    // find closest number from values array

    const closest = values.reduce((prev, curr) => {
      return Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev;
    }, 0);

    setValue(closest);
  };

  useEffect(() => {
    if (selectedOption) {
      onSettingsChange?.({ interval: selectedOption.interval, subswaps: selectedOption.subswaps });
    }
  }, [onSettingsChange, selectedOption]);

  return (
    <Flex animateOpacity in as={Collapse} w="100%">
      <Card gap={1} p={3} sx={{ w: 'full', borderRadius: 16 }} variant="filledContainerTertiary">
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
                  <SliderFilledTrack bg="brand.btnSecondary" boxSize={2} width="50%" />
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
                            <Text textStyle="caption-xs">{selectedOption?.interval} blocks</Text>
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
                    bg: 'brand.btnSecondary',
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
                    bg: value > 50 ? 'brand.btnSecondary' : 'textSecondary',
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
                  onClick={() => setValue(0)}
                  size="xs"
                  sx={{ px: 2 }}
                  variant="borderlessPrimary"
                >
                  Faster
                </Button>
              </Flex>
              <Flex>
                <Button onClick={() => setValue(50)} size="xs" variant="borderlessPrimary">
                  Best pice
                </Button>
              </Flex>
              <Flex>
                <Button
                  onClick={() => setValue(100)}
                  size="xs"
                  sx={{ px: 2 }}
                  variant="borderlessPrimary"
                >
                  Slower
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Collapse animateOpacity in={value > 0}>
          <SwapSlippage
            outputAmount={outputAmount}
            outputAsset={outputAsset}
            route={route}
            setSlippagePercent={setSlippagePercent}
            slippagePercent={slippagePercent}
          />

          <Flex flex={1} flexWrap="wrap" ml={2}>
            <Flex direction="column" flex={1}>
              <Text color="textSecondary" fontWeight="semibold" textStyle="caption-xs">
                Minimum received:
              </Text>
              <Text textStyle="caption-xs">
                {slippagePercent === 0
                  ? 'n/a'
                  : `${minReceive.toCurrency('')} ${outputAsset?.ticker || ''}`}
              </Text>
            </Flex>
            <Flex flex={1} flexDirection="column">
              <Text color="textSecondary" fontWeight="semibold" textStyle="caption-xs">
                Estimated output:
              </Text>
              <Flex>
                <Text textStyle="caption-xs">
                  {outputAmount.toCurrency('')} {outputAsset?.ticker || ''}
                </Text>

                <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
                  (+{formatPrice(priceOptimization)})
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Collapse>
      </Card>
    </Flex>
  );
};
