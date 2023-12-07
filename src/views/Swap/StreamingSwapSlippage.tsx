import {
  Collapse,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
  Text,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import type { AssetValue } from '@swapkit/core';
import { SwapKitNumber } from '@swapkit/core';
import { Icon } from 'components/Atomic';
import { Tooltip } from 'components/Atomic/Tooltip';
import type { RouteWithApproveType } from 'components/SwapRouter/types';
import { useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  route?: RouteWithApproveType;
  outputAmount: SwapKitNumber;
  outputAsset: AssetValue;
  slippagePercent: number;
  setSlippagePercent: (value: number) => void;
};

const sliderScale = 4;
const startSlipSliderValue = 15;
const maxSlip = 10;
const minSlip = 1;

export const StreamingSwapSlippage = ({
  route,
  outputAsset,
  outputAmount,
  slippagePercent,
  setSlippagePercent,
}: Props) => {
  const [slipValue, setSlipValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isChangingValue, setIsChangingValue] = useState(false);

  const outputAmountValue = useMemo(() => {
    const maxOutpuAmount = new SwapKitNumber({
      value: route?.streamingSwap?.expectedOutput || 0,
      decimal: outputAsset.decimal,
    });

    const outputRatio = outputAmount.div(maxOutpuAmount);
    const outputValue = Math.floor(outputRatio.getValue('number') * 100);
    const roundedValue = Math.round(outputValue * 100) / 100;
    const slipPercent = 100 - Number(roundedValue);

    return roundedValue < 100 ? 100 - slipPercent * 6 : 100;
  }, [outputAmount, outputAsset.decimal, route?.streamingSwap?.expectedOutput]);

  useEffect(() => {
    const sliderSlipValue = startSlipSliderValue + (maxSlip - slippagePercent) * sliderScale;
    setSlipValue(slippagePercent > 0 ? sliderSlipValue : 0);
  }, [slippagePercent]);

  const mainColor = slippagePercent > 0 ? 'brand.btnPrimary' : 'brand.orange';

  const onChange = (values: number[]) => {
    if (values[0] < startSlipSliderValue / 2) {
      setSlippagePercent(0);
      return;
    }

    const updatedSlip = maxSlip - (values[0] - startSlipSliderValue) / sliderScale;
    if (updatedSlip <= minSlip) {
      setSlippagePercent(minSlip);
      return;
    }

    if (updatedSlip >= maxSlip) {
      setSlippagePercent(maxSlip);
      return;
    }

    setSlippagePercent(Math.min(updatedSlip, maxSlip));
  };

  return (
    <Flex animateOpacity in as={Collapse} w="100%">
      <Flex>
        <Text color="textSecondary" fontWeight="semibold" ml={2} textStyle="caption">
          {t('common.slippageSettings')}
        </Text>

        <Tooltip content={t('common.slippageTooltip')} place="bottom">
          <Icon className="ml-1" color="secondary" name="infoCircle" size={18} />
        </Tooltip>
      </Flex>

      <Flex
        flex={1}
        gap={1}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        px={3}
        py={2}
      >
        <Flex direction="column" w="100%">
          <Flex gap={2.5}>
            <RangeSlider
              onChange={(values) => onChange(values)}
              onChangeEnd={() => setIsChangingValue(false)}
              onChangeStart={() => setIsChangingValue(true)}
              size="lg"
              value={[slipValue, outputAmountValue]}
            >
              <RangeSliderTrack bg="textSecondary" boxSize={2}>
                <RangeSliderFilledTrack bg={mainColor} boxSize={2} width="50%" />
              </RangeSliderTrack>
              <ChakraTooltip
                hasArrow
                bg="bgPrimary"
                isOpen={showTooltip || isChangingValue}
                label={
                  <Stack p={1}>
                    {slippagePercent === 0 ? (
                      <Text color="brand.orange" textStyle="caption-xs">
                        No price protection
                      </Text>
                    ) : (
                      <Flex>
                        <Text textStyle="caption-xs" variant="secondary">
                          Slippage: &nbsp;
                        </Text>
                        <Text
                          color={
                            slippagePercent === 1 || slippagePercent === 10
                              ? 'brand.yellow'
                              : slippagePercent === 3
                                ? 'brand.green'
                                : 'textPrimary'
                          }
                          textStyle="caption-xs"
                        >
                          {slippagePercent}%
                        </Text>
                      </Flex>
                    )}
                  </Stack>
                }
                placement="top"
              >
                <RangeSliderThumb boxSize={4} index={0} />
              </ChakraTooltip>

              <RangeSliderThumb
                bgColor={mainColor}
                boxSize={3}
                index={1}
                sx={{ pointerEvents: 'none' }}
              />

              <Flex
                onClick={() => setSlippagePercent(0)}
                sx={{
                  w: 4,
                  h: 4,
                  borderRadius: '50%',
                  bg: 'textSecondary',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '-8px',
                }}
              />

              <Flex
                onClick={() => setSlippagePercent(1)}
                sx={{
                  w: 4,
                  h: 4,
                  borderRadius: '50%',
                  bg: slippagePercent > 0 ? 'textSecondary' : mainColor,
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: `calc(${startSlipSliderValue}% - 7px)`,
                }}
              />

              {/*<Flex
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
                /> */}
            </RangeSlider>
          </Flex>

          {/* <Flex flex={1} justify="space-between" mt={1}>
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
            </Flex> */}
        </Flex>
      </Flex>

      {/* <Collapse animateOpacity in={!!priceOptimization}>
          <Flex gap={1}>
            <Text color="textSecondary" fontWeight="semibold" ml={2} textStyle="caption-xs">
              {t('views.swap.savings')}:
            </Text>
            <Text textStyle="caption-xs">
              {outputAmount.toSignificant(6)} {outputAsset?.ticker || ''}
            </Text>

            <Text color="brand.green" fontWeight="normal" textStyle="caption-xs">
              (+{formatPrice(priceOptimization)})
            </Text>
          </Flex>
        </Collapse> */}
    </Flex>
  );
};
