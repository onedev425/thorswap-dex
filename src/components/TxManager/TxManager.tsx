import classNames from 'classnames';
import { Box, Card, Icon, SwitchToggle, Tooltip, Typography } from 'components/Atomic';
import { baseHoverClass } from 'components/constants';
import { Popover } from 'components/Popover';
import { Scrollbar } from 'components/Scrollbar';
import { showSuccessToast } from 'components/Toast';
import { useTxManager } from 'hooks/useTxManager';
import { ElementRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { t } from 'services/i18n';
import { TxTracker, TxTrackerStatus } from 'store/midgard/types';

import { TxContent } from './components/TxContent';
import { TxHeader } from './components/TxHeader';
import { TxPanel } from './components/TxPanel';
import { TxManagerOpenButton } from './TxManagerOpenButton';
import { getTxType } from './utils';

export const TxManager = () => {
  const [onlyPending, setOnlyPending] = useState(false);
  const [isOpen, setIsOpened] = useState(false);

  const { txTrackers, clearTxTrackers } = useTxManager();
  const [filteredTxData, setFilteredTxData] = useState(txTrackers);
  const prevPendingCountRef = useRef(0);

  const pendingCount = filteredTxData.filter(
    (tx) => tx.status === TxTrackerStatus.Pending || tx.status === TxTrackerStatus.Submitting,
  ).length;

  const prevTxTrackerStatus = useRef<{
    [key: TxTracker['uuid']]: TxTrackerStatus;
  }>({});

  useEffect(() => {
    filteredTxData.forEach((txTracker: TxTracker) => {
      if (
        prevTxTrackerStatus.current[txTracker.uuid] !== txTracker.status &&
        txTracker.status === TxTrackerStatus.Success
      ) {
        showSuccessToast(
          t('notification.successfulTransaction'),
          <Box col className="z-10 w-full col alignCenter row">
            <Box row className="py-1">
              <Box alignCenter row>
                <Typography className="mx-1" fontWeight="semibold" variant="caption">
                  {getTxType()[txTracker.type]}
                </Typography>
              </Box>
              <TxHeader txInfo={txTracker} />
            </Box>

            <Box col className="w-full py-2 alignCenter">
              <TxContent txTracker={txTracker} />
            </Box>
          </Box>,
          { position: 'bottom-right' },
        );
        prevTxTrackerStatus.current[txTracker.uuid] = txTracker.status;
      }
    });
  }, [filteredTxData]);

  useEffect(() => {
    if (!onlyPending) {
      return setFilteredTxData(txTrackers);
    }

    const filteredData = txTrackers.filter((item) =>
      [TxTrackerStatus.Pending, TxTrackerStatus.Submitting].includes(item.status),
    );

    setFilteredTxData(filteredData);
  }, [onlyPending, txTrackers]);

  const popoverRef = useRef<ElementRef<typeof Popover>>(null);

  useEffect(() => {
    if (isOpen) {
      popoverRef.current?.open();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!txTrackers.length) {
      popoverRef.current?.close();
    }
  }, [txTrackers.length]);

  useLayoutEffect(() => {
    if (pendingCount && pendingCount > prevPendingCountRef.current) {
      // Timeout to wait for modal animation
      setTimeout(() => setIsOpened(true), 300);
    }

    prevPendingCountRef.current = pendingCount;
  }, [pendingCount]);

  return (
    <Popover
      disabled={!txTrackers?.length}
      onClose={() => setIsOpened(false)}
      ref={popoverRef}
      trigger={<TxManagerOpenButton txData={txTrackers} />}
    >
      <Card className="mt-2 !px-0 md:w-[350px] border border-solid border-btn-primary" size="sm">
        <Box col className="w-full gap-4 !my-2">
          <Box col className="!mx-4">
            <Box justify="between">
              <Typography variant="subtitle2">{t('common.yourTransactions')}</Typography>
            </Box>

            <Box alignCenter className="pt-2" justify="between">
              <Box alignCenter className="gap-x-2 rounded-2xl">
                <SwitchToggle
                  checked={onlyPending}
                  className={classNames(
                    onlyPending
                      ? '!bg-light-border-primary dark:!bg-dark-bg-primary'
                      : 'bg-light-border-primary dark:!bg-dark-gray-light',
                  )}
                  onChange={setOnlyPending}
                />
                <Typography variant="caption">{t('txManager.onlyPending')}</Typography>
              </Box>

              <Tooltip content={t('common.clearHistory')}>
                <Icon
                  className={baseHoverClass}
                  color="secondary"
                  name="trash"
                  onClick={clearTxTrackers}
                  size={18}
                />
              </Tooltip>
            </Box>
          </Box>

          <Scrollbar maxHeight={450}>
            <Box col className="!mx-4 py-0.5">
              {filteredTxData.map((item) => (
                <Box alignCenter row className="first:!mt-0 !mt-1" key={item.uuid}>
                  <TxPanel txTracker={item} />
                </Box>
              ))}

              {!filteredTxData.length && (
                <Box center className="py-3">
                  <Typography color="secondary">{t('txManager.noTxToDisplay')}</Typography>
                </Box>
              )}
            </Box>
          </Scrollbar>
        </Box>
      </Card>
    </Popover>
  );
};
