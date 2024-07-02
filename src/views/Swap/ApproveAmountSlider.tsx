import {
  Tooltip as ChakraTooltip,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";
import { type AssetValue, SwapKitNumber } from "@swapkit/sdk";
import { Button, Icon, Tooltip } from "components/Atomic";
import { t } from "i18next";
import { useEffect, useState } from "react";

type Props = {
  balance: AssetValue;
  setApproveAmount: (amount?: string) => void;
};

export const ApproveAmountSlider = ({ balance, setApproveAmount }: Props) => {
  const [isChangingValue, setIsChangingValue] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // treat 3 times balance as maximum manual value, if higher, treat as infinite
  const infiniteBalance = balance?.mul(3).add(1);
  const step = 10 ** Math.round(Math.log10(balance?.div(100).getValue("number")));

  const [sliderValue, setSliderValue] = useState(balance);
  const moreThanBalance = balance.lte(sliderValue);

  const mainColor =
    moreThanBalance && sliderValue.lt(infiniteBalance) ? "brand.btnPrimary" : "brand.orange";

  useEffect(() => {
    setApproveAmount(
      infiniteBalance?.eqValue(sliderValue) ? undefined : sliderValue.getValue("string"),
    );
  }, [infiniteBalance, setApproveAmount, sliderValue]);

  return (
    <>
      <Flex direction="row" flex={1} mb={2} mt={1}>
        <Text mb={3}>
          {t("views.swap.amountToApprove")}:{" "}
          {sliderValue === infiniteBalance
            ? "Infinite"
            : new SwapKitNumber(sliderValue).toSignificant()}{" "}
          {balance.ticker}
        </Text>

        <Tooltip content={t("views.swap.amountToApproveExplanation")} place="top">
          <Icon className="ml-1" color="secondary" name="infoCircle" size={18} />
        </Tooltip>
      </Flex>

      <Flex
        mx={2}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Slider
          max={infiniteBalance.getValue("number")}
          onChange={(value) => setSliderValue(balance.set(value))}
          onChangeEnd={() => setIsChangingValue(false)}
          onChangeStart={() => setIsChangingValue(true)}
          size="lg"
          step={step}
          value={sliderValue.getValue("number")}
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
                    {sliderValue.eqValue(infiniteBalance)
                      ? "Infinite"
                      : sliderValue.getValue("string")}{" "}
                    {balance.ticker}
                  </Text>
                </Flex>
                {!moreThanBalance && (
                  <Text color="textPrimary" textStyle="caption-xs">
                    {t("views.swap.approveLessThanBalance")}
                  </Text>
                )}
              </Stack>
            }
            placement="top"
          >
            <SliderThumb bgColor={mainColor} boxSize={4} />
          </ChakraTooltip>

          <Flex
            onClick={() => undefined}
            sx={{
              w: 4,
              h: 4,
              borderRadius: "50%",
              bg: mainColor,
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "-8px",
            }}
          />

          <Flex
            onClick={() => undefined}
            sx={{
              w: 4,
              h: 4,
              borderRadius: "50%",
              bg: "textSecondary",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              right: "-8px",
            }}
          />
        </Slider>
      </Flex>

      <Flex flex={1} justify="end" mt={2} mx={-2}>
        <Tooltip content={t("views.swap.approveDefaultExplanation")}>
          <Button mr={2} onClick={() => setSliderValue(balance)} size="xs" variant="tint">
            {t("common.default")}
          </Button>
        </Tooltip>

        <Tooltip content={t("views.swap.approveInfiniteExplanation")}>
          <Button
            onClick={() => setSliderValue(infiniteBalance)}
            size="xs"
            textColor="brand.orange"
            variant="tint"
          >
            {t("views.swap.infinite")}
          </Button>
        </Tooltip>
      </Flex>
    </>
  );
};
