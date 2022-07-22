import classNames from 'classnames'

import {
  Box,
  Icon,
  Link,
  Tooltip,
  Typography,
  useCollapse,
} from 'components/Atomic'
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron'
import { baseHoverClass } from 'components/constants'
import { HighlightCard } from 'components/HighlightCard'
import { TxContent } from 'components/TxManager/components/TxContent'
import { TxHeader } from 'components/TxManager/components/TxHeader'
import { TxStatusIcon } from 'components/TxManager/components/TxStatusIcon'
import {
  txProgressBorderActiveColors,
  txProgressBorderColors,
} from 'components/TxManager/types'
import {
  getTxProgressStatus,
  getTxTrackerUrl,
  getTxType,
  isSwapType,
} from 'components/TxManager/utils'

import { TxTracker, TxTrackerStatus, TxTrackerType } from 'store/midgard/types'

import { t } from 'services/i18n'

type Props = {
  txTracker: TxTracker
}

export const TxPanel = ({ txTracker }: Props) => {
  const isPending =
    txTracker.status === TxTrackerStatus.Pending ||
    txTracker.status === TxTrackerStatus.Submitting
  const { isActive, contentRef, toggle, maxHeightStyle, collapseClasses } =
    useCollapse({ defaultExpanded: isPending })
  const status = getTxProgressStatus(txTracker)
  const showTxLink =
    (isSwapType(txTracker) || txTracker.type === TxTrackerType.Withdraw) &&
    (txTracker.status === TxTrackerStatus.Pending ||
      txTracker.status === TxTrackerStatus.Success) &&
    txTracker?.submitTx?.txID

  const txUrl = showTxLink
    ? getTxTrackerUrl(txTracker?.submitTx?.txID || '')
    : ''

  return (
    <HighlightCard
      className={classNames(
        'w-full !py-0 !px-0 self-stretch !rounded-xl gap-0 md:gap-0',
        txProgressBorderColors[status],
        { [txProgressBorderActiveColors[status]]: isActive },
      )}
    >
      <Box
        className="px-3 py-2 cursor-pointer"
        justify="between"
        alignCenter
        onClick={toggle}
      >
        <Box className="w-full space-x-3" row alignCenter>
          <TxStatusIcon status={status} />
          <Box col>
            <Box className="space-x-1" row alignCenter>
              <Typography
                fontWeight="semibold"
                variant="caption"
                // color={txProgressColors[getTxProgressStatus(item)]}
              >
                {getTxType()[txTracker.type]}
              </Typography>
            </Box>
            <TxHeader txInfo={txTracker} />
          </Box>
        </Box>

        {txUrl && (
          <Link
            className="inline-flex"
            to={txUrl}
            onClick={(e) => e.stopPropagation()}
          >
            <Tooltip content={t('common.viewOnThoryield')}>
              <Icon
                className={baseHoverClass}
                name="thoryield"
                color="primaryBtn"
                size={20}
              />
            </Tooltip>
          </Link>
        )}

        <CollapseChevron isActive={isActive} />
      </Box>

      <div className={collapseClasses} ref={contentRef} style={maxHeightStyle}>
        <Box className="px-3 pb-2">
          <TxContent txTracker={txTracker} />
        </Box>
      </div>
    </HighlightCard>
  )
}
