import { useState } from 'react'

import { TxBond } from 'views/Multisig/TxBond/TxBond'
import { MultisigTxType } from 'views/Multisig/TxCreate/types'
import { TxDeposit } from 'views/Multisig/TxDeposit/TxDeposit'
import { TxDepositCustom } from 'views/Multisig/TxDepositCustom/TxDepositCustom'
import { TxSend } from 'views/Multisig/TxSend/TxSend'
import { TxTypeSelect } from 'views/Multisig/TxTypeSelect'
import { TxWithdraw } from 'views/Multisig/TxWithdraw/TxWithdraw'

import { Box, Card, Typography } from 'components/Atomic'

export const TxDetailsStep = () => {
  const [txType, setTxType] = useState(MultisigTxType.send)

  return (
    <Box className="w-full gap-1 self-stretch" col flex={1}>
      <Box className="self-stretch mx-2 mb-2" flex={1} center>
        <Box flex={1}>
          <Typography color="secondary">Transaction type:</Typography>
        </Box>
        <Box className="z-20" flex={1}>
          <TxTypeSelect onChange={setTxType} selected={txType} />
        </Box>
      </Box>

      <Card className="!px-2.5 !py-3">
        <Box flex={1}>
          {txType === MultisigTxType.send && <TxSend />}
          {txType === MultisigTxType.bond && <TxBond />}
          {txType === MultisigTxType.deposit && <TxDeposit />}
          {txType === MultisigTxType.withdraw && <TxWithdraw />}
          {txType === MultisigTxType.msgDeposit && <TxDepositCustom />}
        </Box>
      </Card>
    </Box>
  )
}
