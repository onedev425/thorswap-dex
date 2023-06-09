import { Flex, Text } from '@chakra-ui/react';
import { Icon } from 'components/Atomic';
import { t } from 'services/i18n';

type Props = {
  chain: string;
};
export const AnalysisPlaceholder = ({ chain }: Props) => {
  return (
    <Flex align="center" direction="column" gap={4} h="full" justify="center" w="full">
      <Icon color="primary" name="chart" size={48} />
      <Text textAlign="center">
        {t('views.swap.gasHistoryNotSupported', {
          chain,
        })}
      </Text>
    </Flex>
  );
};
