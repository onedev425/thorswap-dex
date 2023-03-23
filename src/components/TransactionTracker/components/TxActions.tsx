import { Flex } from '@chakra-ui/react';
import { Button, Icon } from 'components/Atomic';
import { Confirm } from 'components/Modals/Confirm';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { removeTransaction } from 'store/transactions/slice';

type Props = {
  txHash: string;
  isPending?: boolean;
};

export const TxActions = ({ txHash, isPending }: Props) => {
  const dispatch = useAppDispatch();
  const removeTx = useCallback(() => {
    if (txHash) {
      dispatch(removeTransaction(txHash));
    }
  }, [dispatch, txHash]);
  const [confirmOpened, setConfirmOpened] = useState(false);

  const onDelete = useCallback(() => {
    if (isPending) {
      setConfirmOpened(true);
    } else {
      removeTx();
    }
  }, [isPending, removeTx]);

  return (
    <Flex alignSelf="end" justify="end" mb={2}>
      <Button
        className="!px-2"
        h={8}
        leftIcon={<Icon color="secondary" name="trash" size={16} />}
        onClick={onDelete}
        tooltip={t('txManager.deleteFromHistory')}
        variant="borderlessTint"
      />

      <Confirm
        description={t('txManager.confirmRemovePending')}
        isOpened={confirmOpened}
        onCancel={() => setConfirmOpened(false)}
        onConfirm={() => {
          removeTx();
          setConfirmOpened(false);
        }}
        title={t('common.confirm')}
      />
    </Flex>
  );
};
