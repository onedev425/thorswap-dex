import { ElementRef, useEffect, useRef, useState } from 'react'

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
import { TxPanel } from 'components/TxManager/components/TxPanel'
import { TxManagerOpenButton } from 'components/TxManager/TxManagerOpenButton'

import { TxTrackerStatus } from 'store/midgard/types'

import { useTxManager } from 'hooks/useTxManager'

import { t } from 'services/i18n'

export const TxManager = () => {
  const [onlyPending, setOnlyPending] = useState(false)

  const { txTrackers, clearTxTrackers } = useTxManager()
  const [filteredTxData, setFilteredTxData] = useState(txTrackers)

  useEffect(() => {
    if (!onlyPending) {
      setFilteredTxData(txTrackers)
      return
    }

    const filteredData = txTrackers.filter(
      (item) => item.status === TxTrackerStatus.Pending,
    )

    setFilteredTxData(filteredData)
  }, [onlyPending, txTrackers])

  const popoverRef = useRef<ElementRef<typeof Popover>>(null)

  useEffect(() => {
    if (!txTrackers.length) {
      popoverRef.current?.close()
    }
  })

  return (
    <Popover
      ref={popoverRef}
      disabled={!txTrackers?.length}
      trigger={<TxManagerOpenButton txData={txTrackers} />}
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
                  onClick={clearTxTrackers}
                />
              </Tooltip>
            </Box>
          </Box>

          <Scrollbar maxHeight={344}>
            <Box className="!mx-4" col>
              {filteredTxData.map((item) => (
                <Box
                  className="first:!mt-0 !mt-1"
                  key={item.uuid}
                  row
                  alignCenter
                >
                  <TxPanel txTracker={item} />
                </Box>
              ))}

              {!filteredTxData.length && (
                <Box className="py-3" center>
                  <Typography color="secondary">
                    {t('txManager.noTxToDisplay')}
                  </Typography>
                </Box>
              )}
            </Box>
          </Scrollbar>
        </Box>
      </Card>
    </Popover>
  )
}
