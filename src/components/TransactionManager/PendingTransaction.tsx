import { memo, useEffect, useMemo } from 'react'

import { Box, Icon, Link, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { TxStatusIcon } from 'components/TxManager/components/TxStatusIcon'

import { useGetTxnStatusQuery } from 'store/apiUsage/api'
import { useAppDispatch } from 'store/store'
import { completeTransaction } from 'store/transactions/slice'
import { PendingTransactionType } from 'store/transactions/types'

import { multichain } from 'services/multichain'

export const PendingTransaction = memo(
  ({ id, chain, txid, label, quoteMode }: PendingTransactionType) => {
    const params = useMemo(
      () => ({ quoteMode, txid: txid || '' }),
      [quoteMode, txid],
    )

    const appDispatch = useAppDispatch()

    const { data } = useGetTxnStatusQuery(params, {
      pollingInterval: 3000,
      refetchOnFocus: true,
      skip: !txid,
    })

    const url = txid && multichain().getExplorerTxUrl(chain, txid || '')

    useEffect(() => {
      if (data?.ok && data.result) {
        appDispatch(
          completeTransaction({ id, status: data.status, result: data.result }),
        )
      }
    }, [appDispatch, data, id, txid])

    return (
      <Box flex={1} justify="between" alignCenter>
        <Box className="w-full space-x-3" alignCenter>
          <TxStatusIcon status="pending" size={20} />

          <Typography variant="caption" color="secondary" fontWeight="semibold">
            {label}
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
        ) : null}
      </Box>
    )
  },
)
