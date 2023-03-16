import { Box } from '@chakra-ui/react';
import { Button, Icon } from 'components/Atomic';
import { useTransactionsModal } from 'components/TransactionTracker/useTransactionsModal';
import { t } from 'services/i18n';

type Props = {
  txid?: string;
};

export const TxDetailsButton = ({ txid }: Props) => {
  const { open } = useTransactionsModal();

  if (!txid) return null;

  return (
    <Button
      onClick={() => open(txid)}
      px="16px"
      rightIcon={
        <Box ml={-1.5}>
          <Icon color="primary" name="txDetails" size={16} />
        </Box>
      }
      size="xs"
      variant="outlinePrimary"
    >
      {t('txManager.details')}
    </Button>
  );
};
