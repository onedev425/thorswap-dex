import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box, Card, Icon, SwitchToggle, Tooltip } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { Popover } from 'components/Popover';
import { Scrollbar } from 'components/Scrollbar';
import { CompletedTransaction } from 'components/TransactionManager/CompletedTransaction';
import { transactionBorderColors } from 'components/TransactionManager/helpers';
import { PendingTransaction } from 'components/TransactionManager/PendingTransaction';
import { TransactionContainer } from 'components/TransactionManager/TransactionContainer';
import { ElementRef, memo, useCallback, useEffect, useRef, useState } from 'react';
import { t } from 'services/i18n';
import { useAppDispatch } from 'store/store';
import { useTransactionsState } from 'store/transactions/hooks';
import { clearTransactions } from 'store/transactions/slice';
import { getWalletByChain } from 'store/wallet/actions';

import { OpenButton } from './OpenButton';

export const TransactionManager = memo(() => {
  const completedTransactionIds = useRef<string[]>([]);
  const popoverRef = useRef<ElementRef<typeof Popover>>(null);
  const appDispatch = useAppDispatch();
  const [onlyPending, setOnlyPending] = useState(false);
  const [isOpen, setIsOpened] = useState(false);
  const { pending, completed, transactions } = useTransactionsState();
  const prevTxLength = useRef(transactions.length);

  const handleTransactionsClear = useCallback(() => {
    appDispatch(clearTransactions());
  }, [appDispatch]);

  useEffect(() => {
    if (isOpen) {
      popoverRef.current?.open();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!transactions.length) {
      popoverRef.current?.close();
    } else if (prevTxLength.current < transactions.length) {
      popoverRef.current?.open();
    }

    prevTxLength.current = transactions.length;
  }, [transactions.length]);

  useEffect(() => {
    const transactionsToUpdate = completed.filter(
      ({ id }) => !completedTransactionIds.current.includes(id),
    );
    completedTransactionIds.current = completed.map(({ id }) => id);

    const chainsToUpdate = transactionsToUpdate.reduce((acc, { inChain }) => {
      if (!acc.includes(inChain)) acc.push(inChain);

      return acc;
    }, [] as Chain[]);

    for (const chain of chainsToUpdate) {
      appDispatch(getWalletByChain(chain as Chain));
    }
  }, [appDispatch, completed]);

  return (
    <Popover
      disabled={!transactions?.length}
      onClose={() => setIsOpened(false)}
      ref={popoverRef}
      trigger={<OpenButton hasHistory={!!transactions.length} pendingCount={pending.length} />}
    >
      <Card className="mt-2 !px-0 md:w-[350px] border border-solid border-btn-primary" size="sm">
        <Box col className="w-full gap-4 !my-2">
          <Box col className="!mx-4">
            <Box justify="between">
              <Text textStyle="subtitle2">{t('txManager.transactionHistory')}</Text>
            </Box>

            <Box alignCenter className="pt-2" justify="between">
              <Box alignCenter className="gap-x-2 rounded-2xl">
                <SwitchToggle checked={onlyPending} onChange={setOnlyPending} variant="secondary" />
                <Text textStyle="caption">{t('txManager.onlyPending')}</Text>
              </Box>

              <Tooltip content={t('common.clearHistory')}>
                <Icon
                  className={baseHoverClass}
                  color="secondary"
                  name="trash"
                  onClick={handleTransactionsClear}
                  size={18}
                />
              </Tooltip>
            </Box>
          </Box>

          <Scrollbar maxHeight={450}>
            <Box col className="!mx-4 py-0.5 gap-y-1">
              {pending.map((item) => (
                <TransactionContainer className={transactionBorderColors.pending} key={item.id}>
                  <PendingTransaction {...item} />
                </TransactionContainer>
              ))}

              {!onlyPending &&
                completed.map((item) => (
                  <TransactionContainer
                    className={transactionBorderColors[item.status]}
                    key={item.id}
                  >
                    <CompletedTransaction {...item} />
                  </TransactionContainer>
                ))}
            </Box>
          </Scrollbar>
        </Box>
      </Card>
    </Popover>
  );
});
