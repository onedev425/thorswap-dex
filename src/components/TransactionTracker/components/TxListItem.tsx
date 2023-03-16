import { Card, Flex, Text } from '@chakra-ui/react';
import { transactionTitle } from 'components/TransactionManager/helpers';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import { CompletedTransactionType, PendingTransactionType } from 'store/transactions/types';

type Props = {
  item: CompletedTransactionType | PendingTransactionType;
  onClick: () => void;
  isSelected: boolean;
};

export const TxListItem = ({ item, onClick, isSelected }: Props) => {
  const status = 'status' in item ? item.status : 'pending';

  return (
    <Card
      borderColor={isSelected ? 'brand.btnPrimary' : undefined}
      key={item.id}
      onClick={onClick}
      px={2}
      py={1}
      sx={{ cursor: 'pointer' }}
      variant="filled"
    >
      <Flex>
        <Flex align="center" className="w-full gap-2">
          <TransactionStatusIcon size={20} status={status} />

          <Flex direction="column">
            <Flex align="center">
              <Text fontWeight="semibold">{transactionTitle(item.type)}</Text>
            </Flex>

            <Text fontWeight="semibold" textStyle="caption" variant="secondary">
              {item.label}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};
