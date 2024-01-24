import {
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip as ChakraTooltip,
} from '@chakra-ui/react';
import { type AssetValue, SwapKitNumber } from '@swapkit/core';
import { Button, Icon, Tooltip } from 'components/Atomic';
import { t } from 'i18next';
import { useEffect, useState } from 'react';

type Props = {
  balance: AssetValue;
  setApproveAmount: (amount?: number) => void;
};

export const ApproveAmountSlider = ({ balance, setApproveAmount }: Props) => {
  const [isChangingValue, setIsChangingValue] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const maxBalance = balance?.getValue('number') || 0;
  const threeTimesBalance = maxBalance * 3;
  // treat 3 times balance as maximum manual value, if higher, treat as infinite
  const infiniteBalance = threeTimesBalance + 1;
  const step = 10 ** Math.round(Math.log10(maxBalance / 100));

  const [sliderValue, setSliderValue] = useState(maxBalance);
  const moreThanBalance = sliderValue >= maxBalance;

  const mainColor =
    moreThanBalance && sliderValue < infiniteBalance ? 'brand.btnPrimary' : 'brand.orange';

  useEffect(() => {
    setApproveAmount(infiniteBalance === sliderValue ? undefined : sliderValue);
  }, [infiniteBalance, setApproveAmount, sliderValue]);

  return (
    <>
      <Flex direction="row" flex={1} mb={2} mt={1}>
        <Text mb={3}>
          {t('views.swap.amountToApprove')}:{' '}
          {sliderValue === infiniteBalance
            ? 'Infinite'
            : new SwapKitNumber(sliderValue).toSignificant()}{' '}
          {balance.ticker}
        </Text>

        <Tooltip content={t('views.swap.amountToApproveExplanation')} place="top">
          <Icon className="ml-1" color="secondary" name="infoCircle" size={18} />
        </Tooltip>
      </Flex>

      <Flex
        mx={2}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Slider
          max={infiniteBalance}
          onChange={setSliderValue}
          onChangeEnd={() => setIsChangingValue(false)}
          onChangeStart={() => setIsChangingValue(true)}
          size="lg"
          step={step}
          value={sliderValue}
        >
          <SliderTrack bg="textSecondary" boxSize={2}>
            <SliderFilledTrack bg={mainColor} boxSize={2} width="50%" />
          </SliderTrack>

          <ChakraTooltip
            hasArrow
            bg="bgPrimary"
            isOpen={showTooltip || isChangingValue}
            label={
              <Stack p={1}>
                <Flex>
                  <Text textStyle="caption-xs" variant="secondary">
                    Amount to approve: &nbsp;
                  </Text>
                  <Text color="textPrimary" textStyle="caption-xs">
                    {sliderValue === infiniteBalance ? 'Infinite' : sliderValue} {balance.ticker}
                  </Text>
                </Flex>
                {!moreThanBalance && (
                  <Text color="textPrimary" textStyle="caption-xs">
                    {t('views.swap.approveLessThanBalance')}
                  </Text>
                )}
              </Stack>
            }
            placement="top"
          >
            <SliderThumb bgColor={mainColor} boxSize={4} />
          </ChakraTooltip>

          <Flex
            onClick={() => setSliderValue(0)}
            sx={{
              w: 4,
              h: 4,
              borderRadius: '50%',
              bg: mainColor,
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              left: '-8px',
            }}
          />

          <Flex
            onClick={() => setSliderValue(4)}
            sx={{
              w: 4,
              h: 4,
              borderRadius: '50%',
              bg: 'textSecondary',
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              right: '-8px',
            }}
          />
        </Slider>
      </Flex>

      <Flex flex={1} justify="end" mt={2} mx={-2}>
        <Tooltip content={t('views.swap.approveDefaultExplanation')}>
          <Button mr={2} onClick={() => setSliderValue(maxBalance)} size="xs" variant="tint">
            {t('common.default')}
          </Button>
        </Tooltip>

        <Tooltip content={t('views.swap.approveInfiniteExplanation')}>
          <Button
            onClick={() => setSliderValue(infiniteBalance)}
            size="xs"
            textColor="brand.orange"
            variant="tint"
          >
            {t('views.swap.infinite')}
          </Button>
        </Tooltip>
      </Flex>
    </>
  );
};
