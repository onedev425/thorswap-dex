import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import { CountdownProps, useCountdown } from 'hooks/useCountdown';

export const CircularCountdown = ({ startTimestamp, endTimestamp }: CountdownProps) => {
  const countdown = useCountdown({ startTimestamp, endTimestamp });

  // return just spinner in this case?
  if (!countdown) return null;

  // handle hours
  const { minutes, seconds, percent } = countdown;

  return (
    <Flex position="relative">
      <CircularProgress
        color="brand.btnPrimary"
        size="50px"
        thickness="5px"
        trackColor="borderPrimary"
        value={percent}
      />
      <Flex align="center" h="full" justify="center" position="absolute" w="full">
        <Text fontSize="xs">{`${getTimeValueLabel(minutes)}:${getTimeValueLabel(seconds)}`}</Text>
      </Flex>
    </Flex>
  );
};

const getTimeValueLabel = (value: number) => {
  if (value < 10) return `0${value}`;

  return value;
};
