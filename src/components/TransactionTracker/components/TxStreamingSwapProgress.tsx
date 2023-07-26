import { Box, Flex } from '@chakra-ui/react';
import { StreamingSwapProgressStatus } from '@thorswap-lib/swapkit-api';
import { Tooltip } from 'components/Atomic';
import { memo } from 'react';
import { t } from 'services/i18n';

const statusColors: Record<StreamingSwapProgressStatus, string> = {
  [StreamingSwapProgressStatus.NOT_STARTED]: 'textSecondary',
  [StreamingSwapProgressStatus.SUCCESS]: 'brand.btnSecondary',
  [StreamingSwapProgressStatus.REFUNDED]: 'brand.yellow',
};

export const TxStreamingSwapProgress = memo(
  ({
    total,
    progress,
  }: {
    total: number | null;
    progress: StreamingSwapProgressStatus[] | null;
  }) => {
    if (!progress && !total) return null;

    const items = Array.from({ length: total || 0 }, (_, i) => i);
    const statusLabels: Record<StreamingSwapProgressStatus, string> = {
      [StreamingSwapProgressStatus.NOT_STARTED]: t('txManager.progressStatus.notStarted'),
      [StreamingSwapProgressStatus.SUCCESS]: t('txManager.progressStatus.success'),
      [StreamingSwapProgressStatus.REFUNDED]: t('txManager.progressStatus.refunded'),
    };

    return (
      <Flex gap={1}>
        {items.map((item) => {
          const status = progress?.[item] || StreamingSwapProgressStatus.NOT_STARTED;

          return (
            <Tooltip content={statusLabels[status]} key={item}>
              <Box background={statusColors[status]} borderRadius={4} h={5} w={5} />
            </Tooltip>
          );
        })}
      </Flex>
    );
  },
);
