import { memo } from 'react'

import { useTxBond } from 'views/Multisig/TxBond/hooks'
import { NodeManagePanel } from 'views/Nodes/NodeManagePanel/NodeManagePanel'

import { Box } from 'components/Atomic'

export const TxBond = memo(() => {
  const handleBondAction = useTxBond()

  return (
    <Box className="gap-1" col flex={1}>
      <NodeManagePanel handleBondAction={handleBondAction} skipWalletCheck />
    </Box>
  )
})
