import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { Asset, AssetAmount, ETH_DECIMAL } from '@thorswap-lib/multichain-sdk'
import { Chain } from '@thorswap-lib/types'
import classNames from 'classnames'

import { Box, Icon, Link, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

import { CompletedTransactionType } from 'store/transactions/types'

import { getCustomContract } from 'services/contract'
import { multichain } from 'services/multichain'

import { cutTxPrefix, transactionTitle } from './helpers'
import { TransactionStatusIcon } from './TransactionStatusIcon'

const getTcPart = ({
  asset,
  amount,
  decimal = 8,
}: {
  decimal?: number
  asset: string
  amount: string
}) => {
  try {
    const assetAmount = AssetAmount.fromBaseAmount(amount, decimal)
    const assetName = Asset.fromAssetString(asset)?.name
    return `${assetName} ${assetAmount.toSignificant(6)}`
  } catch {
    return ''
  }
}

const getEthPart = async ({
  asset,
  amount,
}: {
  asset: string
  amount: string
}) => {
  try {
    const contract = getCustomContract(asset)
    const name = await contract.symbol()

    const assetAmount = AssetAmount.fromBaseAmount(
      amount,
      (await contract.decimals()).toNumber() || ETH_DECIMAL,
    )

    return `${name} ${assetAmount.toSignificant(6)}`
  } catch {
    return ''
  }
}

export const CompletedTransaction = memo(
  ({
    inChain,
    outChain,
    type,
    txid,
    label,
    status,
    result,
  }: CompletedTransactionType) => {
    const [loading, setLoading] = useState(true)
    const [transactionLabel, setTransactionLabel] = useState(label)

    const secondTxid = useMemo(
      () =>
        !!result?.transactionHash && txid !== result?.transactionHash
          ? result.transactionHash
          : null,
      [result, txid],
    )

    const handleLabelUpdate = useCallback(async () => {
      if (!result || typeof result === 'string') return
      const inputGetter = inChain === Chain.Ethereum ? getEthPart : getTcPart
      const outputGetter = outChain === Chain.Ethereum ? getEthPart : getTcPart

      const inputLabel = await inputGetter({
        asset: result.inputAsset,
        amount: result.inputAssetAmount,
      })

      const outputLabel = await outputGetter({
        asset: result.outputAsset,
        amount: result.outputAssetAmount,
      })

      setLoading(false)
      setTransactionLabel(
        inputLabel.length && outputLabel.length
          ? `${inputLabel} → ${outputLabel}`
          : label,
      )
    }, [inChain, label, outChain, result])

    useEffect(() => {
      handleLabelUpdate()
    }, [handleLabelUpdate])

    const txUrl = {
      url:
        txid && multichain().getExplorerTxUrl(inChain, cutTxPrefix(txid || '')),
      icon: inChain === Chain.Ethereum ? 'etherscanLight' : 'external',
    } as const

    const secondUrl = {
      url:
        outChain &&
        secondTxid &&
        multichain().getExplorerTxUrl(outChain, cutTxPrefix(secondTxid)),
      icon: outChain === Chain.Ethereum ? 'etherscanLight' : 'external',
    } as const

    return (
      <Box flex={1} justify="between" alignCenter>
        <Box alignCenter className="w-full gap-2">
          <TransactionStatusIcon status={status} size={20} />

          <Box col>
            <Box alignCenter row>
              <Typography
                className={classNames(
                  'text-[15px] pr-1 opacity-75 transition-all',
                  { '!opacity-100': loading },
                )}
                fontWeight="semibold"
              >
                {transactionTitle(type)}
              </Typography>
            </Box>

            <Typography
              variant="caption"
              color="secondary"
              fontWeight="semibold"
            >
              {transactionLabel}
            </Typography>
          </Box>
        </Box>

        {txUrl.url ? (
          <Link
            className="inline-flex"
            to={txUrl.url}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon
              className={baseHoverClass}
              name={txUrl.icon}
              color="secondary"
              size={18}
            />
          </Link>
        ) : null}

        {secondUrl.url ? (
          <Link
            className="inline-flex"
            to={secondUrl.url}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon
              className={baseHoverClass}
              name={secondUrl.icon}
              color="secondary"
              size={18}
            />
          </Link>
        ) : null}
      </Box>
    )
  },
)
