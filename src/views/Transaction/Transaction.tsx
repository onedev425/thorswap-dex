import { CircularProgress, Flex, Text } from '@chakra-ui/react';
import type { TxTrackerDetails } from '@swapkit/api';
import { Card } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { useTransactionDetails } from 'components/TransactionManager/useAdvancedTracker';
import { TxPreview } from 'components/TransactionTracker/components/TxPreview';
import { TxTrackerDetailsProvider } from 'components/TransactionTracker/TxTrackerDetailsContext';
import { ViewHeader } from 'components/ViewHeader';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { t } from 'services/i18n';

const Transaction = () => {
  const { txid = '' } = useParams<{
    txid: string;
  }>();
  const [tx, setTx] = useState<TxTrackerDetails | null>(null);
  const [hasError, setHasError] = useState(false);

  const {
    data,
    isCompleted,
    error: fetchError,
    isLoading,
  } = useTransactionDetails({ hash: txid }, !txid.length);

  useEffect(() => {
    if (data) {
      setTx(data.result as TxTrackerDetails);
    }
  }, [data]);

  useEffect(() => {
    if (fetchError) {
      setHasError(true);
    }
  }, [fetchError]);

  return (
    <TxTrackerDetailsProvider txDetails={tx}>
      <Flex direction="column" sx={{ maxW: '640px', alignSelf: 'center', w: '100%', mt: 2 }}>
        <Helmet
          content="Transaction tracker"
          keywords="Transaction tracker, SWAP, THORSwap, THORChain, DEX, DeFi"
          title="Transaction tracker"
        />
        <ViewHeader title={t('txManager.txDetails')} />
        <Card
          stretch
          className="!rounded-2xl md:!rounded-3xl !p-4 flex-col items-center self-stretch mt-4 space-y-1 shadow-lg md:w-full md:h-auto"
          size="lg"
        >
          {!!tx && (
            <Flex py={4}>
              <TxPreview isCompleted={isCompleted} txDetails={tx} />
            </Flex>
          )}
          {!tx && isLoading && (
            <Flex align="center" direction="column" flex={1} gap={4} justify="center" py={8}>
              <Text variant="secondary">{t('txManager.fetchingTxDetails')}</Text>
              <CircularProgress
                isIndeterminate
                color="brand.btnPrimary"
                size="38px"
                thickness="5px"
                trackColor="transaprent"
              />
            </Flex>
          )}
          {hasError && (
            <Flex align="center" flex={1} justify="center" py={8}>
              <Text color="brand.orange">{t('txManager.couldNotLoadTx')}</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </TxTrackerDetailsProvider>
  );
};

export default Transaction;
