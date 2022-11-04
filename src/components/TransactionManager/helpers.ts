import { Asset, AssetAmount, ETH_DECIMAL } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import { useCallback, useMemo, useState } from 'react';
import { getCustomContract } from 'services/contract';
import { t } from 'services/i18n';
import { TxnResult } from 'store/thorswap/types';
import { TransactionStatus, TransactionType } from 'store/transactions/types';

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
    const assetAmount = AssetAmount.fromBaseAmount(amount, decimal);
    const asset = Asset.fromAssetString(assetString);
    return asset?.L1Chain === Chain.Avalanche
      ? asset?.name
      : `${assetAmount.toSignificant(6)} ${asset?.name}`;
  } catch {
    return '';
  }
};

const getEthPart = async ({ asset, amount }: { asset: string; amount: string }) => {
  try {
    const contract = getCustomContract(asset);
    const name = await contract.symbol();
    const decimals = await contract.decimals();

    const assetAmount = AssetAmount.fromBaseAmount(amount, decimals.toNumber() || ETH_DECIMAL);

    return `${assetAmount.toSignificant(6)} ${name}`;
  } catch {
    return '';
  }
};

export const transactionTitle = (type: TransactionType): string => {
  switch (type) {
    case TransactionType.TC_SEND:
      return t('txManager.send');
    case TransactionType.TC_SWITCH:
      return t('txManager.switch');
    case TransactionType.TC_TNS:
      return t('txManager.registerThorname');
    case TransactionType.TC_LP_ADD:
      return t('txManager.addLiquidity');
    case TransactionType.TC_SAVINGS_ADD:
      return t('txManager.addSavings');

    case TransactionType.TC_SAVINGS_WITHDRAW:
    case TransactionType.TC_LP_WITHDRAW:
      return t('txManager.withdraw');

    case TransactionType.AVAX_APPROVAL:
    case TransactionType.ETH_APPROVAL:
      return t('txManager.approve');

    case TransactionType.TC_STATUS:
    case TransactionType.AVAX_STATUS:
    case TransactionType.ETH_STATUS:
    case TransactionType.UNSUPPORTED:
      return t('appMenu.transaction');

    default:
      return t('txManager.swap');
  }
};

export const transactionBorderColors: Record<TransactionStatus, string> = {
  mined: 'border-btn-secondary dark:hover:!border-btn-secondary',
  pending: 'hover:border-btn-primary dark:hover:!border-btn-primary',
  refund: 'border-yellow dark:hover:!border-yellow',
  error: 'border-pink dark:hover:border-pink',
};

export const cutTxPrefix = (tx: string, prefix = '0x') =>
  tx?.startsWith(prefix) ? tx.slice(prefix.length) : tx;

export const useTxIDFromResult = ({
  txid,
  result,
}: {
  txid?: string;
  result?: string | TxnResult;
}) => {
  const txidFromResult = useMemo(() => {
    if (typeof result === 'string' || !result?.type) return '';

    switch (result.type) {
      case TransactionType.SWAP_ETH_TO_ETH:
      case TransactionType.SWAP_ETH_TO_TC:
      case TransactionType.SWAP_TC_TO_ETH:
      case TransactionType.SWAP_TC_TO_TC:
        return txid !== result.transactionHash ? result.transactionHash : null;

      case TransactionType.TC_SAVINGS_ADD:
      case TransactionType.TC_SAVINGS_WITHDRAW:
      case TransactionType.TC_LP_ADD:
      case TransactionType.TC_LP_WITHDRAW:
        return txid !== result.txID ? result.txID : null;

      default:
        return '';
    }
  }, [txid, result]);

  return txidFromResult;
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
