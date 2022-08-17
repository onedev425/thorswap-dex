import { useState } from 'react'

import { Chain, SupportedChain } from '@thorswap-lib/types'

import { TextareaCopy } from 'views/Multisig/components/TextareaCopy'

import { Box, Button, Icon, Link, Modal, Typography } from 'components/Atomic'
import { InfoTip } from 'components/InfoTip'

import { t } from 'services/i18n'
import { multichain } from 'services/multichain'

type Props = {
  canBroadcast: boolean
  txHash: string
  txBodyStr: string
}

export const TxInfoTip = ({ canBroadcast, txHash, txBodyStr }: Props) => {
  const [isTxModalVisible, setIsTxModalVisible] = useState(false)
  const txUrl = txHash
    ? multichain().getExplorerTxUrl(Chain.THORChain as SupportedChain, txHash)
    : ''

  if (txHash) {
    return (
      <InfoTip className="self-stretch flex-1" type="success">
        <Box className="self-stretch m-2">
          <Box className="self-stretch w-full" flex={1}>
            <Typography variant="caption" color="green">
              {t('views.multisig.txBroadcasted')}
            </Typography>
            <Link to={txUrl}>
              <Box center>
                <Typography
                  className="underline ml-1.5"
                  color="green"
                  variant="caption"
                  fontWeight="bold"
                >
                  {t('views.multisig.viewTx')}
                </Typography>
                <Icon name="external" color="green" size={14} />
              </Box>
            </Link>
          </Box>
        </Box>
      </InfoTip>
    )
  }

  return (
    <InfoTip
      className="self-stretch flex-1"
      type={canBroadcast ? 'info' : 'warn'}
    >
      <Box className="self-stretch ml-2.5" alignCenter justify="between">
        {canBroadcast ? (
          <Typography variant="caption" color="primaryBtn">
            {t('views.multisig.pendingTx')} -{' '}
            {t('views.multisig.txReadyToBroadcast')}
          </Typography>
        ) : (
          <Typography variant="caption" color="yellow">
            {t('views.multisig.pendingTx')} -{' '}
            {t('views.multisig.txMissingSignatures')}
          </Typography>
        )}

        <Button
          variant="tint"
          type="borderless"
          onClick={() => setIsTxModalVisible(true)}
        >
          {t('views.multisig.viewTxData')}
        </Button>
      </Box>

      <Modal
        title={t('views.multisig.transactionData')}
        isOpened={isTxModalVisible}
        onClose={() => setIsTxModalVisible(false)}
      >
        <Box
          className="w-full self-stretch min-w-[330px] md:min-w-[400px]"
          flex={1}
        >
          <TextareaCopy
            className="flex-1 h-[50vh] max-h-[60vh]"
            disabled
            value={txBodyStr}
            copyMessage={t('views.multisig.transactionCopied')}
          />
        </Box>
      </Modal>
    </InfoTip>
  )
}
