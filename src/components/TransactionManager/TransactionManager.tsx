import {
  ElementRef,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from 'react'

import classNames from 'classnames'

import {
  Box,
  Card,
  Icon,
  SwitchToggle,
  Tooltip,
  Typography,
} from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { Popover } from 'components/Popover'
import { Scrollbar } from 'components/Scrollbar'
import { PendingTransaction } from 'components/TransactionManager/PendingTransaction'

import { useAppDispatch, useAppSelector } from 'store/store'
import { clearTransactions } from 'store/transactions/slice'

import { t } from 'services/i18n'

import { OpenButton } from './OpenButton'

export const TransactionManager = memo(() => {
  const popoverRef = useRef<ElementRef<typeof Popover>>(null)
  const appDispatch = useAppDispatch()
  const [onlyPending, setOnlyPending] = useState(false)
  const [isOpen, setIsOpened] = useState(false)

  const { pending, completed } = useAppSelector(({ transactions }) => ({
    pending: transactions.pending
      .concat()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    completed: transactions.completed
      .concat()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
  }))

  const handleTransactionsClear = useCallback(() => {
    appDispatch(clearTransactions())
  }, [appDispatch])

  const transactions = useMemo(
    () => [...pending, ...completed],
    [completed, pending],
  )

  useEffect(() => {
    if (isOpen) {
      popoverRef.current?.open()
    }
  }, [isOpen])

  useEffect(() => {
    if (!transactions.length) {
      popoverRef.current?.close()
    } else {
      popoverRef.current?.open()
    }
  }, [transactions.length])

  return (
    <Popover
      ref={popoverRef}
      disabled={!transactions?.length}
      trigger={
        <OpenButton
          pendingCount={pending.length}
          hasHistory={!!transactions.length}
        />
      }
      onClose={() => setIsOpened(false)}
    >
      <Card
        className="mt-2 !px-0 md:w-[350px] border border-solid border-btn-primary"
        size="sm"
      >
        <Box className="w-full gap-4 !my-2" col>
          <Box className="!mx-4" col>
            <Box justify="between">
              <Typography variant="subtitle2">
                {t('common.yourTransactions')}
              </Typography>
            </Box>

            <Box className="pt-2" justify="between" alignCenter>
              <Box alignCenter className="gap-x-2 rounded-2xl">
                <SwitchToggle
                  className={classNames(
                    onlyPending
                      ? '!bg-light-border-primary dark:!bg-dark-bg-primary'
                      : 'bg-light-border-primary dark:!bg-dark-gray-light',
                  )}
                  checked={onlyPending}
                  onChange={setOnlyPending}
                />
                <Typography variant="caption">
                  {t('txManager.onlyPending')}
                </Typography>
              </Box>

              <Tooltip content={t('common.clearHistory')}>
                <Icon
                  className={baseHoverClass}
                  name="trash"
                  color="secondary"
                  size={18}
                  onClick={handleTransactionsClear}
                />
              </Tooltip>
            </Box>
          </Box>

          <Scrollbar maxHeight={450}>
            <Box className="!mx-4 py-0.5" col>
              {pending.map((item) => (
                <Box
                  className="first:!mt-0 !mt-1"
                  key={item.txid || item.id}
                  row
                  alignCenter
                >
                  <PendingTransaction {...item} />
                </Box>
              ))}
            </Box>
          </Scrollbar>
        </Box>
      </Card>
    </Popover>
  )
})
