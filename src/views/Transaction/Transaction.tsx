import { CircularProgress, Flex, Text } from "@chakra-ui/react";
import type { TxTrackerDetails } from "@swapkit/api";
import type { ChainId } from "@swapkit/sdk";
import { Card } from "components/Atomic";
import { Helmet } from "components/Helmet";
import { useTransactionDetails } from "components/TransactionManager/useAdvancedTracker";
import { TxTrackerDetailsProvider } from "components/TransactionTracker/TxTrackerDetailsContext";
import { TxPreview } from "components/TransactionTracker/components/TxPreview";
import { useTransactionDetailsV2 } from "components/TransactionTrackerV2/useTrackerV2";
import { ViewHeader } from "components/ViewHeader";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { t } from "services/i18n";
import type { TrackerV2Details } from "store/transactions/types";

const Transaction = () => {
  const { txid = "" } = useParams<{
    txid: string;
  }>();
  const [searchParams] = useSearchParams();
  const chainId = searchParams.get("chainId") as ChainId;
  const useApiV2 = !!chainId;

  const [tx, setTx] = useState<(TxTrackerDetails & TrackerV2Details) | null>(null);
  const [hasError, setHasError] = useState(false);

  const {
    data,
    isCompleted,
    error: fetchError,
    isLoading,
  } = useTransactionDetails({ hash: txid }, !txid.length || useApiV2);

  const v2Data = useTransactionDetailsV2(
    {
      hash: txid,
      chainId,
    },
    !useApiV2,
  );

  useEffect(() => {
    if (data || v2Data.data) {
      setTx(data?.result || (v2Data.data as TxTrackerDetails));
    }
  }, [data, v2Data.data]);

  useEffect(() => {
    if (fetchError) {
      setHasError(true);
    }
  }, [fetchError]);

  return (
    <TxTrackerDetailsProvider txDetails={tx}>
      <Flex direction="column" sx={{ maxW: "640px", alignSelf: "center", w: "100%", mt: 2 }}>
        <Helmet
          content="Transaction tracker"
          keywords="Transaction tracker, SWAP, THORSwap, THORChain, DEX, DeFi"
          title="Transaction tracker"
        />
        <ViewHeader title={t("txManager.txDetails")} />
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
              <Text variant="secondary">{t("txManager.fetchingTxDetails")}</Text>
              <CircularProgress
                isIndeterminate
                color="brand.btnPrimary"
                size="38px"
                thickness="5px"
                trackColor="transparent"
              />
            </Flex>
          )}
          {hasError && (
            <Flex align="center" flex={1} justify="center" py={8}>
              <Text color="brand.orange">{t("txManager.couldNotLoadTx")}</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </TxTrackerDetailsProvider>
  );
};

export default Transaction;
