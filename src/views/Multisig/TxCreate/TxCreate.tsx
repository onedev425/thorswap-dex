import { useEffect, useState } from 'react'

import { RefreshButton } from 'views/Multisig/components/RefreshButton'
import { TxBond } from 'views/Multisig/TxBond/TxBond'
import { MultisigTxType } from 'views/Multisig/TxCreate/types'
import { TxDeposit } from 'views/Multisig/TxDeposit/TxDeposit'
import { TxSend } from 'views/Multisig/TxSend/TxSend'
import { TxTypeSelect } from 'views/Multisig/TxTypeSelect'
import { TxWithdraw } from 'views/Multisig/TxWithdraw/TxWithdraw'

import { Box, Typography } from 'components/Atomic'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { useMultisig } from 'store/multisig/hooks'

import { t } from 'services/i18n'

const TxCreate = () => {
  const { loadBalances } = useMultisig()
  const [txType, setTxType] = useState(MultisigTxType.send)

  useEffect(() => {
    loadBalances()
  }, [loadBalances])

  return (
    <PanelView
      title={t('views.multisig.createTransaction')}
      header={
        <Box className="w-full justify-between align-center">
          <ViewHeader title={t('views.multisig.createTransaction')} withBack />
          <Box className="px-6">
            <RefreshButton />
          </Box>
        </Box>
      }
    >
      <Box className="w-full gap-1 my-4" col>
        <Box className="self-stretch mx-2 pt-2" flex={1} center>
          <Box flex={1}>
            <Typography color="secondary">Transaction type:</Typography>
          </Box>
          <Box className="z-20" flex={1}>
            <TxTypeSelect onChange={setTxType} selected={txType} />
          </Box>
        </Box>

        <Box className="mt-6" flex={1}>
          {txType === MultisigTxType.send && <TxSend />}
          {txType === MultisigTxType.bond && <TxBond />}
          {txType === MultisigTxType.deposit && <TxDeposit />}
          {txType === MultisigTxType.withdraw && <TxWithdraw />}
        </Box>
      </Box>
    </PanelView>
  )
}

export default TxCreate
