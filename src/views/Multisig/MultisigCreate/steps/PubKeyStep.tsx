import classNames from 'classnames';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { genericBgClasses, lightInputBorder } from 'components/constants';
import { FieldLabel } from 'components/Form';
import { HighlightCard } from 'components/HighlightCard';
import { StepActions } from 'components/Stepper';
import { showSuccessToast } from 'components/Toast';
import copy from 'copy-to-clipboard';
import { useNavigate } from 'react-router';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/constants';
import { useWallet } from 'store/wallet/hooks';

type Props = {
  pubKey: string;
};

export const PubKeyStep = ({ pubKey }: Props) => {
  const navigate = useNavigate();
  const { setIsConnectModalOpen } = useWallet();

  const handleCopyPubKey = () => {
    copy(pubKey);
    showSuccessToast(t('views.multisig.pubKeyCopied'));
  };

  return (
    <Box col className="self-stretch mx-2" flex={1}>
      <Box col className="gap-5" flex={1}>
        <Typography fontWeight="normal" variant="caption">
          {t('views.multisig.createMultisigPubKeyInfo')}
        </Typography>
        <Typography fontWeight="normal" variant="caption">
          {t('views.multisig.connectThorchainCurrentlyKeystore')}
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
                      '!px-2 !py-3 truncate overflow-hidden flex-1 !border-opacity-20 hover:!border-opacity-100',
                      lightInputBorder,
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
                        <Icon className="px-2" name="copy" size={16} />
                      </div>
                    </Box>
                  </HighlightCard>
                </Box>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Box>

      <StepActions backAction={() => navigate(ROUTES.Multisig)} backLabel={t('common.cancel')} />
    </Box>
  );
};
