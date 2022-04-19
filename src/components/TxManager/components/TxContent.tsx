import { Fragment } from 'react'

import { Box } from 'components/Atomic'
import { useTxDetails } from 'components/TxManager/hooks/useTxDetails'

import { TxTracker } from 'store/midgard/types'

import { TxInfoRow } from './TxInfoRow'

type Props = {
  txTracker: TxTracker
}

export const TxContent = ({ txTracker }: Props) => {
  const txDetails = useTxDetails(txTracker)

  if (!txDetails) {
    return null
  }

  return (
    <Box className="gap-1 flex-1" col>
      {txDetails.map((item) => (
        <Fragment key={`${item.status}${item.label}`}>
          <Box className="border-t border-b-0 border-solid flex-1 border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20"></Box>
          <TxInfoRow {...item} />
        </Fragment>
      ))}
    </Box>
  )
}
