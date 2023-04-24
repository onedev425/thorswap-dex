import { Flex, Text } from '@chakra-ui/react';
import { Amount } from '@thorswap-lib/swapkit-core';
import { Button, Icon } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { InfoWithTooltip } from 'components/InfoWithTooltip';
import { showSuccessToast } from 'components/Toast';
import { TxDetailsStatusInfo } from 'components/TransactionTracker/components/TxDetailsStatusInfo';
import { formatDuration, getTxDuration, getTxState } from 'components/TransactionTracker/helpers';
import copy from 'copy-to-clipboard';
import { getTickerFromIdentifier } from 'helpers/logoURL';
import { shortenAddress } from 'helpers/shortenAddress';
import { useCounter } from 'hooks/useCountdown';
import { t } from 'services/i18n';
import { TxTrackerDetails } from 'store/transactions/types';

type Props = {
  txDetails: TxTrackerDetails;
  isCompleted: boolean;
  totalTimeLeft: number | null;
};

export const TxDetailsInfo = ({ txDetails, isCompleted, totalTimeLeft }: Props) => {
  const txCounter = useCounter({
    startTimestamp: isCompleted ? null : txDetails.legs?.[0]?.startTimestamp,
  });

  if (!txDetails) return null;

  const { legs, firstTransactionHash, status } = txDetails;
  const { error } = getTxState(status);
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];
  const duration = getTxDuration(legs);

  const firstLegInfo =
    (!!firstLeg.fromAmount &&
      parseFloat(firstLeg.fromAmount) &&
      `${Amount.fromAssetAmount(firstLeg.fromAmount, 18).toSignificant(
        6,
      )} ${getTickerFromIdentifier(firstLeg.fromAsset || '')}`) ||
    '';

  const lastLegInfo =
    (!!lastLeg.toAmount &&
      parseFloat(lastLeg.toAmount) &&
      `${Amount.fromAssetAmount(lastLeg.toAmount, 18).toSignificant(6)} ${getTickerFromIdentifier(
        lastLeg.toAsset || '',
      )}`) ||
    '';

  const swapLabel = `${firstLegInfo}${lastLegInfo ? ` -> ${lastLegInfo}` : ''}`;
  const txUrl = `${window.location.origin}/tx/${firstTransactionHash}`;

  return (
    <Flex direction="column" mt={{ base: 2, lg: 6 }} w="full">
      <InfoRow
        label={t('views.thorname.status')}
        size="md"
        value={
          <Flex align="center" gap={1} justify="center">
            <TxDetailsStatusInfo totalTimeLeft={totalTimeLeft} txDetails={txDetails} />
          </Flex>
        }
      />

      {swapLabel && <InfoRow label={t('txManager.swap')} size="md" value={swapLabel} />}

      {legs.length > 0 && (
        <InfoRow
          label={null}
          size="md"
          value={
            <Flex flexWrap="wrap" gap={2} justifyContent="space-between" py={1} w="full">
              <Flex align="center" gap={1}>
                <Text color="textSecondary" fontWeight="medium" textStyle="caption">
                  {t('txManager.started')}:
                </Text>
                <Text fontWeight="semibold" textStyle="caption">
                  {new Date(firstLeg?.startTimestamp || '').toLocaleString('default', {
                    dateStyle: 'short',
                    timeStyle: 'medium',
                  })}
                </Text>
              </Flex>
              {isCompleted && !error && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" fontWeight="medium" textStyle="caption">
                    {t('txManager.completed')}:
                  </Text>
                  <Text fontWeight="semibold" textStyle="caption">
                    {new Date(lastLeg?.endTimestamp || '').toLocaleString('default', {
                      dateStyle: 'short',
                      timeStyle: 'medium',
                    })}
                  </Text>
                </Flex>
              )}

              {((!!txCounter && !!txCounter.timeSince) || !!duration) && (
                <Flex align="center" gap={1}>
                  <Text color="textSecondary" fontWeight="medium" textStyle="caption">
                    {t('txManager.duration')}:
                  </Text>
                  <InfoWithTooltip
                    icon="timer"
                    tooltip={t('txManager.totalTimeTooltip')}
                    value={
                      <Text
                        fontWeight="semibold"
                        minW="45px"
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
          <Flex flexWrap="wrap">
            <Button
              className="!px-2 h-auto"
              onClick={() => {
                showSuccessToast(t('txManager.txIdCopied'));
                copy(firstTransactionHash);
              }}
              rightIcon={<Icon color="primaryBtn" name="copy" size={14} />}
              size="xs"
              tooltip={t('txManager.copyTxId')}
              variant="borderlessTint"
            >
              {shortenAddress(firstTransactionHash, 8, 8)}
            </Button>
            <Button
              className="!px-2 h-auto"
              onClick={() => {
                showSuccessToast(t('txManager.txUrlCopied'));
                copy(txUrl);
              }}
              rightIcon={
                <Icon className="-mt-[5px]" color="primaryBtn" name="shareUrl" size={14} />
              }
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
