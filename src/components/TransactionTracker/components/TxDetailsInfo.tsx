import { Flex, Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Button, Icon } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { showSuccessToast } from 'components/Toast';
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon';
import {
  formatDuration,
  getTxDisplayStatus,
  getTxDuration,
  getTxState,
  getTxStatusColor,
  getTxStatusLabel,
} from 'components/TransactionTracker/helpers';
import copy from 'copy-to-clipboard';
import { getTickerFromIdentifier } from 'helpers/logoURL';
import { shortenAddress } from 'helpers/shortenAddress';
import { useCounter } from 'hooks/useCountdown';
import { t } from 'services/i18n';
import { TxTrackerDetails } from 'store/transactions/types';

type Props = {
  txDetails: TxTrackerDetails;
  isCompleted: boolean;
};

export const TxDetailsInfo = ({ txDetails, isCompleted }: Props) => {
  const txCounter = useCounter({
    startTimestamp: isCompleted ? null : txDetails.legs?.[0]?.startTimestamp,
  });

  if (!txDetails) return null;

  const { legs, firstTransactionHash, status } = txDetails;
  const { error } = getTxState(status);
  const txid = firstTransactionHash;
  const txStatus = getTxDisplayStatus(status);
  const hasLegs = legs.length > 0;
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  const duration = getTxDuration(legs);

  const swapLabel =
    firstLeg.fromAmount && lastLeg.toAmount
      ? `${Amount.fromAssetAmount(firstLeg.fromAmount, 18).toSignificantWithMaxDecimals(
          6,
        )} ${getTickerFromIdentifier(firstLeg.fromAsset || '')} → ${Amount.fromAssetAmount(
          lastLeg.toAmount,
          18,
        ).toSignificantWithMaxDecimals(6)} ${getTickerFromIdentifier(lastLeg.toAsset || '')} `
      : '';

  const txUrl = `${window.location.origin}/tx/${txid}`;

  return (
    <Flex direction="column" mt={8} w="full">
      <InfoRow
        label={t('views.thorname.status')}
        size="md"
        value={
          <Flex gap={1}>
            <Text
              color={getTxStatusColor(txStatus)}
              textStyle="caption-xs"
              textTransform="uppercase"
            >
              {getTxStatusLabel(txStatus)}
            </Text>
            <TransactionStatusIcon size={18} status={txStatus} />
          </Flex>
        }
      />
      {swapLabel && <InfoRow label={t('txManager.swap')} size="md" value={swapLabel} />}

      {hasLegs && (
        <InfoRow
          label={null}
          size="md"
          value={
            <Flex flexWrap="wrap" gap={2} justifyContent="space-between" py={1} w="full">
              <Flex align="center" gap={1}>
                <Text color="textSecondary" textStyle="caption-xs">
                  {t('txManager.started')}:
                </Text>
                <Text fontWeight="textPrimary" textStyle="caption-xs">
                  {new Date(firstLeg?.startTimestamp || '').toLocaleString('default', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  })}
                </Text>
              </Flex>
              {isCompleted && !error && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" textStyle="caption-xs">
                    {t('txManager.completed')}:
                  </Text>
                  <Text fontWeight="textPrimary" textStyle="caption-xs">
                    {new Date(lastLeg?.endTimestamp || '').toLocaleString('default', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </Text>
                </Flex>
              )}

              {((!!txCounter && !!txCounter.timeSince) || !!duration) && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" textStyle="caption-xs">
                    {t('txManager.duration')}:
                  </Text>
                  <InfoWithTooltip
                    icon="timer"
                    tooltip={t('txManager.totalTimeTooltip')}
                    value={
                      <Text
                        fontWeight="textPrimary"
                        minW="50px"
                        textStyle="caption-xs"
                        whiteSpace="nowrap"
                      >
                        {formatDuration(txCounter?.timeSince || (duration as number))}
                      </Text>
                    }
                  />
                </Flex>
              )}
            </Flex>
          }
        />
      )}

      <InfoRow
        label={t('txManager.shareTransaction')}
        size="md"
        value={
          <Flex>
            <Button
              className="!px-2 h-auto"
              onClick={() => {
                showSuccessToast(t('txManager.txIdCopied'));
                copy(txid);
              }}
              rightIcon={<Icon color="primaryBtn" name="copy" size={14} />}
              size="xs"
              tooltip={t('txManager.copyTxId')}
              variant="borderlessTint"
            >
              {shortenAddress(txid, 8, 8)}
            </Button>
            <Button
              className="!px-2 h-auto"
              onClick={() => {
                showSuccessToast(t('txManager.txUrlCopied'));
                copy(txUrl);
              }}
              rightIcon={<Icon color="primaryBtn" name="shareUrl" size={14} />}
              size="xs"
              tooltip={`${t('txManager.copyTxUrl')}: ${txUrl}`}
              variant="borderlessTint"
            >
              {t('txManager.shareTxUrl')}
            </Button>
          </Flex>
        }
      />
    </Flex>
  );
};
