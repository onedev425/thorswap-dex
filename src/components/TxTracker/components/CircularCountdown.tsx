import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import { Icon, Tooltip } from 'components/Atomic';
import { formatDuration } from 'components/TransactionTracker/helpers';
import { useLayoutEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';

export const CircularCountdown = ({
  timeLeft,
  estimatedDuration,
  hasDetails,
}: {
  timeLeft: number | null;
  estimatedDuration: number | null;
  hasDetails?: boolean;
}) => {
  const [size, setSize] = useState('20px');
  const [showTime, setShowTime] = useState(false);
  const percent = timeLeft && estimatedDuration ? (timeLeft / estimatedDuration) * 100 : 0;

  useLayoutEffect(() => {
    if (hasDetails) {
      setSize('50px');
      setTimeout(() => setShowTime(true), 200);
    } else {
      setSize('20px');
      setShowTime(false);
    }
  }, [hasDetails]);

  const tooltipContent = useMemo(() => {
    if (timeLeft == null) return '';
    if (timeLeft <= 0) return t('txManager.txFinishing');
    return t('txManager.estimatedTime', {
      timeLeft: formatDuration(timeLeft),
    });
  }, [timeLeft]);

  return (
    <Tooltip content={tooltipContent}>
      <Flex position="relative">
        <CircularProgress
          animation="linear 0.2"
          color="brand.btnPrimary"
          isIndeterminate={!percent || !timeLeft || timeLeft < 0}
          size={size}
          sx={{
            '& svg': {
              transition: 'all 0.2s ease-in-out',
            },
          }}
          thickness="5px"
          trackColor="borderPrimary"
          value={percent}
        />

        {showTime && (
          <Flex align="center" h="full" justify="center" position="absolute" w="full">
            {!!timeLeft && timeLeft > 0 && (
              <Text fontSize="xs">{formatDuration(timeLeft, { approx: true, noUnits: true })}</Text>
            )}
            {((!timeLeft && hasDetails) || (timeLeft && timeLeft <= 0)) && (
              <Icon color="secondary" name="hourglass" size={14} />
            )}
          </Flex>
        )}
      </Flex>
    </Tooltip>
  );
};
