import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link, Modal } from 'components/Atomic';
import { InfoTip } from 'components/InfoTip';
import { useEffect, useState } from 'react';
import { t } from 'services/i18n';
import { TextareaCopy } from 'views/Multisig/components/TextareaCopy';

type Props = {
  canBroadcast: boolean;
  txHash: string;
  txBodyStr: string;
};

export const TxInfoTip = ({ canBroadcast, txHash, txBodyStr }: Props) => {
  const [isTxModalVisible, setIsTxModalVisible] = useState(false);
  const [txUrl, setTxUrl] = useState('');

  useEffect(() => {
    import('services/swapKit')
      .then(({ getSwapKitClient }) => getSwapKitClient())
      .then(({ getExplorerTxUrl }) =>
        setTxUrl(txHash ? getExplorerTxUrl(Chain.THORChain as Chain, txHash) : ''),
      );
  }, [setTxUrl, txHash]);

  if (txHash) {
    return (
      <InfoTip className="self-stretch flex-1" type="success">
        <Box className="self-stretch m-2">
          <Box className="self-stretch w-full" flex={1}>
            <Text textStyle="caption" variant="green">
              {t('views.multisig.txBroadcasted')}
            </Text>
            <Link to={txUrl}>
              <Box center>
                <Text
                  className="underline ml-1.5"
                  fontWeight="bold"
                  textStyle="caption"
                  variant="green"
                >
                  {t('views.multisig.viewTx')}
                </Text>
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
          <Text textStyle="caption" variant="primaryBtn">
            {t('views.multisig.pendingTx')} - {t('views.multisig.txReadyToBroadcast')}
          </Text>
        ) : (
          <Text textStyle="caption" variant="yellow">
            {t('views.multisig.pendingTx')} - {t('views.multisig.txMissingSignatures')}
          </Text>
        )}

        <Button onClick={() => setIsTxModalVisible(true)} variant="borderlessTint">
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
