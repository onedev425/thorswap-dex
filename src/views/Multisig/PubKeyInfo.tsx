import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { FieldLabel } from 'components/Form';
import { HighlightCard } from 'components/HighlightCard';
import { InfoTip } from 'components/InfoTip';
import { showSuccessToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { multichain } from 'services/multichain';
import { useWallet } from 'store/wallet/hooks';
import { MultisigModal } from 'views/Multisig/MultisigModal/MultisigModal';

export const PubKeyInfo = () => {
  const [isMultisigModalOpened, setMultisigModalOpened] = useState(false);
  const { wallet, setIsConnectModalOpen } = useWallet();
  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || '';
  const pubKey = useMemo(() => {
    try {
      return connectedWalletAddress ? multichain().thor.getPubkey() : '';
    } catch (e) {
      return '';
    }
  }, [connectedWalletAddress]);

  const handleCopyPubKey = () => {
    copy(pubKey);
    showSuccessToast(t('views.multisig.pubKeyCopied'));
  };

  return (
    <InfoTip title="Public key" type="info">
      <Box col className="self-stretch mx-2" flex={1}>
        <Box col className="gap-1" flex={1}>
          <Typography className="my-3" fontWeight="light">
            {t('views.multisig.publicKeyInfo')}
          </Typography>
          <Typography className="my-3" fontWeight="light">
            {t('views.multisig.connectThorchainWallet')}
          </Typography>
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
                        <Typography
                          className="break-all whitespace-normal"
                          color="secondary"
                          variant="caption"
                        >
                          {pubKey}
                        </Typography>
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
