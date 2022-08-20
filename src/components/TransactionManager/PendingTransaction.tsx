import { memo, useEffect, useMemo } from 'react'

import { QuoteMode } from '@thorswap-lib/multichain-sdk'

import { Box, Icon, Link, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import {
  cutTxPrefix,
  transactionTitle,
} from 'components/TransactionManager/helpers'
import { TransactionStatusIcon } from 'components/TransactionManager/TransactionStatusIcon'

import { useGetTxnStatusQuery } from 'store/apiUsage/api'
import { useAppDispatch } from 'store/store'
import { completeTransaction } from 'store/transactions/slice'
import { PendingTransactionType } from 'store/transactions/types'

import { multichain } from 'services/multichain'

export const PendingTransaction = memo(
  ({
    id,
    inChain,
    txid,
    type,
    from,
    label,
    quoteMode,
  }: PendingTransactionType) => {
    const params = useMemo(() => {
      const isMidgardTx = [
        QuoteMode.TC_SUPPORTED_TO_TC_SUPPORTED_TO,
        QuoteMode.TC_SUPPORTED_TO_ETH,
      ].includes(quoteMode)

      return {
        from,
        quoteMode: type === 'approve' ? QuoteMode.APPROVAL : quoteMode,
        txid: cutTxPrefix(txid || '', isMidgardTx ? '0x' : ''),
      }
    }, [from, quoteMode, txid, type])

    const appDispatch = useAppDispatch()

    const { data } = useGetTxnStatusQuery(params, {
      pollingInterval: 3000,
      refetchOnFocus: true,
      skip: !params.txid,
    })

    const url = txid && multichain().getExplorerTxUrl(inChain, txid)

    useEffect(() => {
      if (data?.ok && data.result) {
        appDispatch(
          completeTransaction({ id, status: data.status, result: data.result }),
        )
      }
    }, [appDispatch, data, id, txid])

    return (
      <Box flex={1} justify="between" alignCenter>
        <Box alignCenter className="w-full gap-2">
          <TransactionStatusIcon status="pending" size={20} />

          <Box col className="gap-x-2">
            <Typography fontWeight="semibold">
              {transactionTitle(type)}
            </Typography>

            <Typography
              variant="caption"
              color="secondary"
              fontWeight="semibold"
            >
              {label}
            </Typography>
          </Box>
        </Box>

        {url ? (
          <Link
            className="inline-flex"
            to={url}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon
              className={baseHoverClass}
              name={txid?.startsWith('0x') ? 'etherscanLight' : 'external'}
              color="secondary"
              size={18}
            />
          </Link>
        ) : null}
      </Box>
    )
  },
)
