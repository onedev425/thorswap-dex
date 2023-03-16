import { Flex } from '@chakra-ui/react';
import { Button, Icon } from 'components/Atomic';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { removeTransaction } from 'store/transactions/slice';

type Props = {
  txHash: string;
};

export const TxActions = ({ txHash }: Props) => {
  const dispatch = useAppDispatch();
  const removeTx = () => {
    if (txHash) {
      dispatch(removeTransaction(txHash));
    }
  };

  return (
    <Flex alignSelf="end" justify="end" mb={2}>
      <Button
        className="!px-2"
        h={8}
        leftIcon={<Icon color="secondary" name="trash" size={16} />}
        onClick={removeTx}
        tooltip={t('txManager.deleteFromHistory')}
        variant="borderlessTint"
      />
    </Flex>
  );
};
