import { Flex, Text } from '@chakra-ui/react';
import { Button, Icon } from 'components/Atomic';
import { Confirm } from 'components/Modals/Confirm';
import { useTransactionsModal } from 'components/TransactionTracker/useTransactionsModal';
import { useCallback, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { removeTransaction } from 'store/transactions/slice';

type Props = {
  txHash: string;
  isPending?: boolean;
};

export const TxActions = ({ txHash, isPending }: Props) => {
  const { next, previous, hasNext, hasPrev, selectedIndex, allCount } = useTransactionsModal();
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
    <Flex flex={1} justifyContent="space-between" mb={2}>
      <Flex align="center" gap={2}>
        <Button
          className="!px-2"
          disabled={!hasPrev}
          h={8}
          leftIcon={
            <Icon className="-ml-[2px] -mt-[1px]" color="secondary" name="chevronLeft" size={16} />
          }
          onClick={previous}
          tooltip={t('txManager.prevTx')}
          variant="borderlessTint"
        />

        <Flex>
          <Text textStyle="caption-xs" variant="secondary">
            {selectedIndex !== null ? selectedIndex + 1 : ' '} / {allCount || '-'}
          </Text>
        </Flex>

        <Button
          className="!px-2"
          disabled={!hasNext}
          h={8}
          leftIcon={<Icon color="secondary" name="chevronRight" size={16} />}
          onClick={next}
          tooltip={t('txManager.nextTx')}
          variant="borderlessTint"
        />
      </Flex>
      <Flex>
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
    </Flex>
  );
};
