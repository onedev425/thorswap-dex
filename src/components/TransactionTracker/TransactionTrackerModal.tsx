import { Card, CircularProgress, Flex, Text } from '@chakra-ui/react';
import { Modal } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { Scrollbar } from 'components/Scrollbar';
import { transactionTitle } from 'components/TransactionManager/helpers';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import { TxActions } from 'components/TransactionTracker/components/TxActions';
import { TxList } from 'components/TransactionTracker/components/TxList';
import { TxPreview } from 'components/TransactionTracker/components/TxPreview';
import { getTxStatusColor, getTxStatusLabel } from 'components/TransactionTracker/helpers';
import { TxTrackerDetailsProvider } from 'components/TransactionTracker/TxTrackerDetailsContext';
import { useTransactionsModal } from 'context/txManager/useTransactionsModal';
import { memo } from 'react';
import { t } from 'services/i18n';

export const TransactionTrackerModal = memo(() => {
  const { selectedTx, selectedTxId, setSelectedTxId, isOpened, close } = useTransactionsModal();
  const hasDetailsParams = selectedTx?.txid && selectedTx?.route && selectedTx?.quoteId;

  return (
    <Modal
      isOpened={isOpened}
      onClose={close}
      sx={{ maxW: { base: '90vw', lg: '900px' } }}
      title=""
      withBody={false}
    >
      <TxTrackerDetailsProvider txDetails={selectedTx?.details}>
        <Flex flex={1} gap={3} justifyContent="space-between" minH="350px">
          <Flex alignSelf="stretch" direction="column" display={['none', 'none', 'flex']}>
            <Text fontWeight={600} mx={3} my={1} textStyle="h4" variant="primary">
              {t('txManager.history')}
            </Text>
            <Card height="full" variant="filledContainerSecondary">
              <TxList onSelect={setSelectedTxId} selectedId={selectedTxId} />
            </Card>
          </Flex>

          <Flex alignSelf="stretch" direction="column" flex={1}>
            <Text fontWeight={600} mx={3} my={1} textStyle="h4" variant="primary">
              {t('txManager.txDetails')}
            </Text>
            <Card height="full" px={4} variant="filledContainerSecondary">
              <Scrollbar maxHeight="80vh">
                <Flex direction="column" flex={1} justifyContent="flex-start" maxH="80vh">
                  {selectedTx && (
                    <TxActions
                      isPending={selectedTx.details?.status === 'pending'}
                      txHash={selectedTx.id || ''}
                    />
                  )}

                  {selectedTx && !selectedTx.details && (
                    <>
                      {hasDetailsParams ? (
                        <Flex align="center" direction="column" flex={1} gap={4} justify="center">
                          <Text variant="secondary">{t('txManager.fetchingTxDetails')}</Text>
                          <CircularProgress
                            isIndeterminate
                            color="brand.btnPrimary"
                            size="38px"
                            thickness="5px"
                            trackColor="transaprent"
                          />
                        </Flex>
                      ) : (
                        <Flex direction="column" flex={1} gap={4} px={30}>
                          <Flex direction="column" gap={4}>
                            <Flex align="center">
                              <Text fontWeight="semibold">{transactionTitle(selectedTx.type)}</Text>
                            </Flex>

                            <Text fontWeight="semibold" textStyle="caption" variant="secondary">
                              {selectedTx?.label}
                            </Text>
                          </Flex>

                          <InfoRow
                            label={t('views.thorname.status')}
                            size="md"
                            value={
                              <Flex gap={1}>
                                <Text
                                  color={getTxStatusColor(selectedTx.status || null)}
                                  textStyle="caption-xs"
                                  textTransform="uppercase"
                                >
                                  {getTxStatusLabel(selectedTx.status || null)}
                                </Text>
                                <TransactionStatusIcon size={18} status={selectedTx.status} />
                              </Flex>
                            }
                          />
                        </Flex>
                      )}
                    </>
                  )}

                  {selectedTx?.details && (
                    <TxPreview
                      isCompleted={!!selectedTx.completed}
                      txDetails={selectedTx.details}
                    />
                  )}
                </Flex>
              </Scrollbar>
            </Card>
          </Flex>
        </Flex>
      </TxTrackerDetailsProvider>
    </Modal>
  );
});
