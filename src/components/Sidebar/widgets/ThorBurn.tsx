import { Box, Flex, keyframes, Link, Progress, ScaleFade, Text } from '@chakra-ui/react';
import { SwapKitNumber } from '@swapkit/core';
import { Icon, Tooltip } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { Fire } from 'components/Fire/Fire';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useGetMonthlyTradeVolumeQuery } from 'store/midgard/api';

const colorBurn = keyframes`
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const TARGET_AMOUNT = new SwapKitNumber({ value: 12000000, decimal: 8 });
const currentMonth = dayjs().format('MMMM');
const INFO_ARTICLE_URL = 'https://twitter.com/THORSwap/status/1653655296336879618';

export const ThorBurn = ({ collapsed }: { collapsed?: boolean }) => {
  const [totalVolume, setTotalVolume] = useState(SwapKitNumber.fromBigInt(0n));
  const { data } = useGetMonthlyTradeVolumeQuery();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (data?.intervals?.[0]) {
      const volume = SwapKitNumber.fromBigInt(BigInt(data.intervals[0].totalVolume));
      setTotalVolume(volume);
    }
  }, [data]);

  const filledPercentRaw = useMemo(() => {
    const percentString = totalVolume.div(TARGET_AMOUNT).mul(100).toFixed(2);

    return Math.round(Number(percentString) || 0);
  }, [totalVolume]);

  const filledPercent = useMemo(() => {
    return Math.min(filledPercentRaw, 100);
  }, [filledPercentRaw]);

  const triggerReached = useMemo(() => filledPercent >= 100, [filledPercent]);

  const tooltipContent = `${currentMonth} burn trade volume:\n${totalVolume.toAbbreviation(
    2,
  )} RUNE out of ${TARGET_AMOUNT.toAbbreviation(0)} RUNE`;

  useEffect(() => {
    if (triggerReached) {
      setShowAnimation(true);
    }
  }, [triggerReached]);

  return (
    <Flex direction="column" flex={1} gap={1} px={1}>
      {!collapsed && (
        <Flex flex={1} justify="space-between" width="full">
          <Text
            fontSize={10}
            fontWeight="semibold"
            textStyle="caption-xs"
            textTransform="uppercase"
            variant="secondary"
          >
            Burn volume target
          </Text>
        </Flex>
      )}

      <Tooltip content={tooltipContent} place="bottom">
        <Flex
          direction="column"
          flex={1}
          gap={1}
          onMouseEnter={() => !triggerReached && setShowAnimation(true)}
          onMouseLeave={() => !triggerReached && setShowAnimation(false)}
        >
          <Box position="relative">
            <Progress
              animation={triggerReached ? `${colorBurn} 2s ease-in infinite` : undefined}
              size="sm"
              sx={{
                '& > div': {
                  transitionProperty: 'width',
                  background: 'linear-gradient(0deg, #FFB359 10%, #E98566 90%)',
                  borderRightRadius: 10,
                },
                borderRadius: 10,
              }}
              value={filledPercent}
            />

            <Box h="100%" left={0} position="absolute" top={0} w="100%" zIndex={-1}>
              <Progress
                size="sm"
                sx={{
                  '& > div': {
                    transitionProperty: 'width',
                    background: 'linear-gradient(0deg, #de562c 10%, #ff2357 90%)',
                    borderRightRadius: 10,
                  },
                  borderRadius: 10,
                }}
                value={filledPercent}
              />
            </Box>

            {!collapsed && (
              <Box bottom={-1.5} left={`${filledPercent}%`} ml={-5} position="absolute">
                <ScaleFade unmountOnExit in={showAnimation} initialScale={0}>
                  <Fire />
                </ScaleFade>
              </Box>
            )}
          </Box>

          {!collapsed && (
            <Flex flex={1} justify="space-between" width="full">
              <Text
                fontWeight="semibold"
                textStyle="caption-xs"
                textTransform="uppercase"
                variant="secondary"
              >
                Reached: {filledPercentRaw}%
              </Text>
              <Link href={INFO_ARTICLE_URL} referrerPolicy="no-referrer" target="_blank">
                <Icon
                  className={baseTextHoverClass}
                  color="secondary"
                  name="infoCircle"
                  size={16}
                />
              </Link>
            </Flex>
          )}
        </Flex>
      </Tooltip>
    </Flex>
  );
};
