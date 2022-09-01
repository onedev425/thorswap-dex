import { Chain, SupportedChain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link, Modal, Typography } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { TextareaCopy } from 'views/Multisig/components/TextareaCopy';

type Props = {
  canBroadcast: boolean;
  txHash: string;
  txBodyStr: string;
};

export const TxInfoTip = ({ canBroadcast, txHash, txBodyStr }: Props) => {
  const [isTxModalVisible, setIsTxModalVisible] = useState(false);
  const txUrl = txHash
    ? multichain().getExplorerTxUrl(Chain.THORChain as SupportedChain, txHash)
    : '';

  if (txHash) {
    return (
      <InfoTip className="self-stretch flex-1" type="success">
        <Box className="self-stretch m-2">
          <Box className="self-stretch w-full" flex={1}>
            <Typography color="green" variant="caption">
              {t('views.multisig.txBroadcasted')}
            </Typography>
            <Link to={txUrl}>
              <Box center>
                <Typography
                  className="underline ml-1.5"
                  color="green"
                  fontWeight="bold"
                  variant="caption"
                >
                  {t('views.multisig.viewTx')}
                </Typography>
                <Icon color="green" name="external" size={14} />
              </Box>
            </Link>
          </Box>
        </Box>
      </InfoTip>
    );
  }

  return (
    <InfoTip className="self-stretch flex-1" type={canBroadcast ? 'info' : 'warn'}>
      <Box alignCenter className="self-stretch ml-2.5" justify="between">
        {canBroadcast ? (
          <Typography color="primaryBtn" variant="caption">
            {t('views.multisig.pendingTx')} - {t('views.multisig.txReadyToBroadcast')}
          </Typography>
        ) : (
          <Typography color="yellow" variant="caption">
            {t('views.multisig.pendingTx')} - {t('views.multisig.txMissingSignatures')}
          </Typography>
        )}

        <Button onClick={() => setIsTxModalVisible(true)} type="borderless" variant="tint">
          {t('views.multisig.viewTxData')}
        </Button>
      </Box>

      <Modal
        isOpened={isTxModalVisible}
        onClose={() => setIsTxModalVisible(false)}
        title={t('views.multisig.transactionData')}
      >
        <Box className="w-full self-stretch min-w-[330px] md:min-w-[400px]" flex={1}>
          <TextareaCopy
            disabled
            className="flex-1 h-[50vh] max-h-[60vh]"
            copyMessage={t('views.multisig.transactionCopied')}
            value={txBodyStr}
          />
        </Box>
      </Modal>
    </InfoTip>
  );
};
