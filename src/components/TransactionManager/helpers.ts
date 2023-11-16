import type { TxTrackerDetails } from '@swapkit/api';
import { TxStatus } from '@swapkit/api';
import { AssetValue, BaseDecimal, Chain } from '@swapkit/core';
import { useCallback, useState } from 'react';
import { getCustomContract } from 'services/contract';
import { t } from 'services/i18n';
import type { TxnResult } from 'store/thorswap/types';
import type { TransactionStatus } from 'store/transactions/types';
import { TransactionType } from 'store/transactions/types';

const getTcPart = ({
  asset: assetString,
  amount,
  decimal = 8,
}: {
  decimal?: number;
  asset: string;
  amount: string;
}) => {
  try {
    const assetAmount = AssetValue.fromBigInt(BigInt(amount), decimal);
    const asset = AssetValue.fromStringSync(assetString);
    return asset?.chain === Chain.Avalanche
      ? asset?.ticker
      : `${assetAmount.toSignificant(6)} ${asset?.ticker}`;
  } catch {
    return '';
  }
};

const getEthPart = async ({ asset, amount }: { asset: string; amount: string }) => {
  try {
    const contract = await getCustomContract(asset);
    const name = await contract.symbol();
    const decimals = await contract.decimals();

    const assetAmount = AssetValue.fromBigInt(
      BigInt(amount),
      decimals.toNumber() || BaseDecimal.ETH,
    );

    return `${assetAmount.toSignificant(6)} ${name}`;
  } catch {
    return '';
  }
};

export const transactionTitle = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.TC_DEPOSIT:
      return t('txManager.deposit');
    case TransactionType.TC_SEND:
      return t('txManager.send');

    case TransactionType.TC_LENDING:
    case TransactionType.TC_LENDING_OPEN:
    case TransactionType.TC_LENDING_CLOSE:
      return t('txManager.loan');

    case TransactionType.TC_SWITCH:
      return t('txManager.switch');
    case TransactionType.TC_TNS_UPDATE:
      return t('txManager.updateThorname');
    case TransactionType.TC_TNS_CREATE:
      return t('txManager.registerThorname');
    case TransactionType.TC_LP_ADD:
      return t('txManager.addLiquidity');

    case TransactionType.TC_SAVINGS_ADD:
      return t('txManager.addEarn');

    case TransactionType.TC_SAVINGS_WITHDRAW:
    case TransactionType.TC_LP_WITHDRAW:
      return t('txManager.withdraw');

    case TransactionType.AVAX_APPROVAL:
    case TransactionType.ETH_APPROVAL:
    case TransactionType.BSC_APPROVAL:
      return t('txManager.approve');

    case TransactionType.TC_STATUS:
    case TransactionType.AVAX_STATUS:
    case TransactionType.ETH_STATUS:
    case TransactionType.BSC_STATUS:
    case TransactionType.UNSUPPORTED:
      return t('appMenu.transaction');

    default:
      return t('txManager.swap');
  }
};

export const transactionBorderColors: Record<TransactionStatus, string> = {
  mined: 'border-btn-secondary dark:hover:!border-btn-secondary',
  pending: 'hover:border-btn-primary dark:hover:!border-btn-primary',
  unknown: 'hover:border-btn-primary dark:hover:!border-btn-primary',
  notStarted: 'hover:border-btn-primary dark:hover:!border-btn-primary',
  refund: 'border-yellow dark:hover:!border-yellow',
  error: 'border-pink dark:hover:border-pink',
};

export const cutTxPrefix = (tx = '', prefix = '0x') => {
  /**
   * Temporary fix to figure out dev quotes
   */
  const stringTx = String(tx);

  const isHex = stringTx.startsWith(prefix);
  const isUpperHex = stringTx.startsWith(prefix.toUpperCase());

  if (isHex) return stringTx.slice(prefix.length);
  if (isUpperHex) return stringTx.toLowerCase().slice(prefix.length).toUpperCase();
  return stringTx;
};

export const useTxLabelUpdate = ({
  result,
  setTransactionLabel,
}: {
  result?: TxnResult | string;
  setTransactionLabel: (label: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const resultType = ((typeof result === 'string' ? result : result?.type) || '').toUpperCase();
  const inputGetter = [TransactionType.SWAP_ETH_TO_ETH, TransactionType.SWAP_ETH_TO_TC].includes(
    resultType as TransactionType,
  )
    ? getEthPart
    : getTcPart;
  const outputGetter = [TransactionType.SWAP_ETH_TO_ETH, TransactionType.SWAP_TC_TO_ETH].includes(
    resultType as TransactionType,
  )
    ? getEthPart
    : getTcPart;

  const handleLabelUpdate = useCallback(async () => {
    if (
      ![
        TransactionType.SWAP_ETH_TO_ETH,
        TransactionType.SWAP_ETH_TO_TC,
        TransactionType.SWAP_TC_TO_ETH,
        TransactionType.SWAP_TC_TO_TC,
        TransactionType.TC_LP_WITHDRAW,
      ].some((type) => type === resultType)
    ) {
      return;
    }

    switch (resultType) {
      case TransactionType.TC_LP_WITHDRAW: {
        // @ts-expect-error
        const outAssets = Object.entries(result.out);
        const labelParts = outAssets
          // @ts-expect-error
          .map(([asset, { amount }]) => getTcPart({ asset, amount }))
          .filter(Boolean);
        outAssets.length !== labelParts.length;

        if (outAssets.length === labelParts.length) {
          setTransactionLabel(labelParts.join(' & '));
        }
        break;
      }

      case TransactionType.SWAP_ETH_TO_TC:
      case TransactionType.SWAP_TC_TO_ETH:
      case TransactionType.SWAP_TC_TO_TC: {
        // @ts-expect-error
        const { inputAsset, outputAsset, outputAssetAmount, inputAssetAmount } = result;
        const inputLabel = await inputGetter({ asset: inputAsset, amount: inputAssetAmount });
        const outputLabel = await outputGetter({ asset: outputAsset, amount: outputAssetAmount });

        setIsLoading(false);

        if (inputLabel.length && outputLabel.length) {
          setTransactionLabel(`${inputLabel} → ${outputLabel}`);
        }
        break;
      }
    }
  }, [inputGetter, outputGetter, result, resultType, setTransactionLabel]);

  return { isLoading, handleLabelUpdate };
};

export const getSimpleTxStatus = (status: TxStatus): TransactionStatus => {
  switch (status) {
    case TxStatus.SUCCESS:
      return 'mined';
    case TxStatus.PENDING:
      return 'pending';
    case TxStatus.REFUNDED:
    case TxStatus.REPLACED:
      return 'refund';
    case TxStatus.ERROR:
    case TxStatus.CANCELLED:
      return 'error';
    case TxStatus.UNKNOWN:
    case TxStatus.RETRIES_EXCEEDED:
      return 'unknown';
    case TxStatus.NOT_STARTED:
      return 'notStarted';
    default:
      return 'pending';
  }
};

export function getEstimatedTxDuration(txDetails?: TxTrackerDetails) {
  if (!txDetails) return null;

  const totalDurationFromLegs = txDetails.legs.reduce<number | null>((acc, leg) => {
    if (
      acc === null ||
      leg.estimatedDuration === null ||
      typeof leg.estimatedDuration === 'undefined'
    )
      return null;

    return acc + Number(leg.estimatedDuration);
  }, 0);

  return totalDurationFromLegs || Number(txDetails.estimatedDuration) || null;
}
