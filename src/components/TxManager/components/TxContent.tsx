import { Box } from 'components/Atomic'
import { TxInfoRow } from 'components/TxManager/components/TxInfoRow'
import { useTxDetails } from 'components/TxManager/hooks/useTxDetails'

import { TxTracker } from 'redux/midgard/types'

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
        <>
          <Box className="border-t border-b-0 border-solid flex-1 border-light-typo-gray dark:border-dark-typo-gray !border-opacity-20"></Box>
          <TxInfoRow
            key={`${item.status}${item.label}`}
            status={item.status}
            label={item.label}
            url={item.url}
          />
        </>
      ))}
    </Box>
  )
}
