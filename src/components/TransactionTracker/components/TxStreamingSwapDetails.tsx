import { Flex, Text } from '@chakra-ui/react';
import type { StreamingSwapDetails } from '@thorswap-lib/swapkit-api';
import { TxStreamingSwapProgress } from 'components/TransactionTracker/components/TxStreamingSwapProgress';
import { memo } from 'react';
import { t } from 'services/i18n';

export const TxStreamingSwapDetails = memo(
  ({
    streamingSwapDetails: { completed, progress, total },
  }: {
    streamingSwapDetails: StreamingSwapDetails;
  }) => {
    return (
      <Flex direction="column">
        <Flex align="center" justify="space-between">
          <Text fontWeight="medium" textStyle="caption" variant="secondary">
            {t('txManager.streamingSwapDetails')}
          </Text>

          {total && (
            <Flex>
              <Text fontWeight="medium" textStyle="caption-xs" variant="primary">
                {t('txManager.completed')} {completed || 0} / {total}
              </Text>
            </Flex>
          )}
        </Flex>

        <Flex flex={1} justify="flex-end" mt={1}>
          <TxStreamingSwapProgress progress={progress} total={total} />
        </Flex>

        <Flex borderBottom="1px solid" borderColor="textSecondary" mt={2} opacity={0.2} w="full" />
      </Flex>
    );
  },
);
