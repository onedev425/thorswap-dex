import { memo, useEffect } from 'react'

import { Box, Icon, Link, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { TxStatusIcon } from 'components/TxManager/components/TxStatusIcon'

import { useGetTxnStatusQuery } from 'store/apiUsage/api'
import { useAppDispatch } from 'store/store'
import { completeTransaction } from 'store/transactions/slice'
import { PendingTransactionType } from 'store/transactions/types'

import { multichain } from 'services/multichain'

export const PendingTransaction = memo(
  ({ chain, txid, quoteMode }: PendingTransactionType) => {
    const appDispatch = useAppDispatch()
    const { data } = useGetTxnStatusQuery(
      { txid: txid || '', quoteMode },
      { pollingInterval: 3000, skip: !txid },
    )

    const url = txid && multichain().getExplorerTxUrl(chain, txid || '')

    useEffect(() => {
      if (data?.ok && data.result) {
        appDispatch(
          completeTransaction({
            id: data.result.transactionHash,
            status: data.status,
          }),
        )
      }
    }, [appDispatch, data, txid])

    return (
      <Box justify="between" alignCenter>
        <Box className="w-full space-x-3" alignCenter>
          <Box center style={{ width: 24, height: 24 }}>
            <TxStatusIcon status="pending" size={16} />
          </Box>

          <Typography variant="caption" fontWeight="normal">
            {data?.ok ? `${data.result}` : 'Pending'}
          </Typography>
        </Box>

        {url ? (
          <Link
            className="inline-flex"
            to={url}
            onClick={(e) => e.stopPropagation()}
          >
            <Icon
              className={baseHoverClass}
              name="external"
              color="secondary"
              size={18}
            />
          </Link>
        ) : (
          <div></div>
        )}
      </Box>
    )
  },
)
