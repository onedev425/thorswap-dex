import { Asset, AssetAmount, ETH_DECIMAL } from '@thorswap-lib/multichain-sdk';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Icon, Link, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { getCustomContract } from 'services/contract';
import { multichain } from 'services/multichain';
import { CompletedTransactionType } from 'store/transactions/types';

import { cutTxPrefix, transactionTitle } from './helpers';
import { TransactionStatusIcon } from './TransactionStatusIcon';

const getTcPart = ({
  asset,
  amount,
  decimal = 8,
}: {
  decimal?: number;
  asset: string;
  amount: string;
}) => {
  try {
    const assetAmount = AssetAmount.fromBaseAmount(amount, decimal);
    const assetName = Asset.fromAssetString(asset)?.name;
    return `${assetAmount.toSignificant(6)} ${assetName}`;
  } catch {
    return '';
  }
};

const getEthPart = async ({ asset, amount }: { asset: string; amount: string }) => {
  try {
    const contract = getCustomContract(asset);
    const name = await contract.symbol();

    const assetAmount = AssetAmount.fromBaseAmount(
      amount,
      (await contract.decimals()).toNumber() || ETH_DECIMAL,
    );

    return `${assetAmount.toSignificant(6)} ${name}`;
  } catch {
    return '';
  }
};

export const CompletedTransaction = memo(
  ({ inChain, outChain, type, txid, label, status, result }: CompletedTransactionType) => {
    const [loading, setLoading] = useState(true);
    const [transactionLabel, setTransactionLabel] = useState(label);

    const secondTxid = useMemo(
      () =>
        !!result?.transactionHash && txid !== result?.transactionHash
          ? result.transactionHash
          : null,
      [result, txid],
    );

    const handleLabelUpdate = useCallback(async () => {
      if (!result || typeof result === 'string') return;
      const inputGetter = inChain === Chain.Ethereum ? getEthPart : getTcPart;
      const outputGetter = outChain === Chain.Ethereum ? getEthPart : getTcPart;

      const inputLabel = await inputGetter({
        asset: result.inputAsset,
        amount: result.inputAssetAmount,
      });

      const outputLabel = await outputGetter({
        asset: result.outputAsset,
        amount: result.outputAssetAmount,
      });

      setLoading(false);
      setTransactionLabel(
        inputLabel.length && outputLabel.length ? `${inputLabel} → ${outputLabel}` : label,
      );
    }, [inChain, label, outChain, result]);

    useEffect(() => {
      handleLabelUpdate();
    }, [handleLabelUpdate]);

    const txUrl = {
      url: txid && multichain().getExplorerTxUrl(inChain, cutTxPrefix(txid || '')),
      icon: inChain === Chain.Ethereum ? 'etherscanLight' : 'external',
    } as const;

    const secondUrl = {
      url:
        outChain && secondTxid && multichain().getExplorerTxUrl(outChain, cutTxPrefix(secondTxid)),
      icon: outChain === Chain.Ethereum ? 'etherscanLight' : 'external',
    } as const;

    return (
      <Box alignCenter flex={1} justify="between">
        <Box alignCenter className="w-full gap-2">
          <TransactionStatusIcon size={20} status={status} />

          <Box col>
            <Box alignCenter row>
              <Typography
                className={classNames('text-[15px] pr-1 opacity-75 transition-all', {
                  '!opacity-100': loading,
                })}
                fontWeight="semibold"
              >
                {transactionTitle(type)}
              </Typography>
            </Box>

            <Typography color="secondary" fontWeight="semibold" variant="caption">
              {transactionLabel}
            </Typography>
          </Box>
        </Box>

        {txUrl.url ? (
          <Link className="inline-flex" onClick={(e) => e.stopPropagation()} to={txUrl.url}>
            <Icon className={baseHoverClass} color="secondary" name={txUrl.icon} size={18} />
          </Link>
        ) : null}

        {secondUrl.url ? (
          <Link className="inline-flex" onClick={(e) => e.stopPropagation()} to={secondUrl.url}>
            <Icon className={baseHoverClass} color="secondary" name={secondUrl.icon} size={18} />
          </Link>
        ) : null}
      </Box>
    );
  },
);
