import { Box, Flex, Link, Progress, ScaleFade, Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Icon, Tooltip } from 'components/Atomic';
import { baseTextHoverClass } from 'components/constants';
import { Fire } from 'components/Fire/Fire';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useGetMonthlyTradeVolumeQuery } from 'store/midgard/api';

const TARGET_AMOUNT = Amount.fromNormalAmount(8000000); // 8M RUNE
const currentMonth = dayjs().format('MMMM');
const INFO_ARTICLE_URL = 'https://twitter.com/THORSwap/status/1653655296336879618';

export const ThorBurn = ({ collapsed }: { collapsed?: boolean }) => {
  const [totalVolume, setTotalVolume] = useState(Amount.fromMidgard(0));
  const { data } = useGetMonthlyTradeVolumeQuery();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (data) {
      const volume = Amount.fromMidgard(data?.intervals[0].totalVolume);
      setTotalVolume(volume);
    }
  }, [data]);

  const filledPercent = useMemo(() => {
    const percentString = totalVolume.div(TARGET_AMOUNT).mul(100).toFixedDecimal(2);

    return Math.round(Number(percentString) || 0);
  }, [totalVolume]);

  const tooltipContent = `${currentMonth} burn trade volume:\n${totalVolume.toAbbreviate(
    2,
  )} RUNE out of ${TARGET_AMOUNT.toAbbreviate(0)} RUNE`;

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
          onMouseEnter={() => setShowAnimation(true)}
          onMouseLeave={() => setShowAnimation(false)}
        >
          <Box position="relative" zIndex={10}>
            <Progress
              size="sm"
              style={{ width: `${filledPercent}%` }}
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
                Reached: {filledPercent}%
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
