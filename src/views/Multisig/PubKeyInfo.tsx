import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { FieldLabel } from 'components/Form';
import { HighlightCard } from 'components/HighlightCard';
import { InfoTip } from 'components/InfoTip';
import { showSuccessToast } from 'components/Toast';
import { useWalletConnectModal } from 'context/wallet/hooks';
import copy from 'copy-to-clipboard';
import { useState } from 'react';
import { t } from 'services/i18n';
import { useMultisig } from 'store/multisig/hooks';
import { MultisigModal } from 'views/Multisig/MultisigModal/MultisigModal';

export const PubKeyInfo = () => {
  const [isMultisigModalOpened, setMultisigModalOpened] = useState(false);
  const { setIsConnectModalOpen } = useWalletConnectModal();
  const { pubKey } = useMultisig();

  const handleCopyPubKey = () => {
    copy(pubKey);
    showSuccessToast(t('views.multisig.pubKeyCopied'));
  };

  return (
    <InfoTip title="Public key" type="info">
      <Box col className="self-stretch mx-2" flex={1}>
        <Box col className="gap-1" flex={1}>
          <Text className="my-3" fontWeight="light">
            {t('views.multisig.publicKeyInfo')}
          </Text>
          <Text className="my-3" fontWeight="light">
            {t('views.multisig.connectThorchainWallet')}
          </Text>
          <Box align="end" flex={1}>
            {!pubKey ? (
              <Button stretch onClick={() => setIsConnectModalOpen(true)} variant="primary">
                {/* {t('views.multisig.multisigModalTitle')} */}
                {t('common.connectWallet')}
              </Button>
            ) : (
              <Box col flex={1}>
                <FieldLabel label="Your wallet's public key:" />
                <Tooltip className="flex flex-1" content={t('common.copy')}>
                  <Box center className="gap-2 cursor-pointer" flex={1} onClick={handleCopyPubKey}>
                    <HighlightCard
                      className={classNames(
                        genericBgClasses.primary,
                        'truncate overflow-hidden flex-1',
                      )}
                    >
                      <Box justify="between">
                        <Text
                          className="break-all whitespace-normal"
                          textStyle="caption"
                          variant="secondary"
                        >
                          {pubKey}
                        </Text>
                        <div>
                          <Icon className="pl-2" name="copy" size={16} />
                        </div>
                      </Box>
                    </HighlightCard>
                  </Box>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Box>

        <MultisigModal
          isOpen={isMultisigModalOpened}
          onCancel={() => setMultisigModalOpened(false)}
        />
      </Box>
    </InfoTip>
  );
};
