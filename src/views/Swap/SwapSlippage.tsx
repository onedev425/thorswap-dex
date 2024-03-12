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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  route?: RouteWithApproveType;
  outputAmount: SwapKitNumber;
  outputAsset: AssetValue;
  slippagePercent: number;
  setSlippagePercent: (value: number) => void;
};

const sliderScale = 6;
const maxOutputScale = 5;
const startSlipSliderValue = 15;
const maxSlip = 10;
const minSlip = 0.5;

export const SwapSlippage = ({
  route,
  outputAsset,
  outputAmount,
  slippagePercent,
  setSlippagePercent,
}: Props) => {
  const [slipValue, setSlipValue] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isChangingValue, setIsChangingValue] = useState(false);
  const recommendedSlippage = route?.meta?.recommendedSlippage;

  const outputAmountValue = useMemo(() => {
    const maxOutputAmount = new SwapKitNumber({
      value: route?.streamingSwap?.expectedOutput || 0,
      decimal: outputAsset.decimal,
    });

    if (maxOutputAmount.lte(0)) return 100;

    const outputRatio = outputAmount.div(maxOutputAmount);
    const maxSlipValue = startSlipSliderValue + maxSlip * sliderScale;

    const outputValue = outputRatio.getValue('number') * 100;
    const slipPercent = 100 - Number(outputValue);

    const scaledValue = getScaledValue(maxSlipValue, slipPercent);

    return outputValue < 100 ? scaledValue : 100;
  }, [outputAmount, outputAsset.decimal, route?.streamingSwap?.expectedOutput]);

  useEffect(() => {
    const sliderSlipValue = startSlipSliderValue + (maxSlip - slippagePercent) * sliderScale;
    setSlipValue(slippagePercent > 0 ? sliderSlipValue : 0);
  }, [slippagePercent]);

  const mainColor = slippagePercent > 0 ? 'brand.btnPrimary' : 'brand.orange';

  const onChange = useCallback(
    (values: number[]) => {
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
    },
    [setSlippagePercent],
  );

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
              step={3}
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
                          color={slippagePercent === 10 ? 'brand.yellow' : 'textPrimary'}
                          textStyle="caption-xs"
                        >
                          {slippagePercent}%
                          {slippagePercent === recommendedSlippage &&
                            ` (${t('common.recommended')})`}
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
            </RangeSlider>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

function getScaledValue(maxValue: number, slipPercent: number) {
  let scale = maxOutputScale;
  let scaledValue = 100 - slipPercent * scale;

  while (scale > 0 && maxValue > scaledValue) {
    scale -= 1;
    scaledValue = 100 - slipPercent * scale;
  }

  return scaledValue;
}
