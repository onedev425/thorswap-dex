import { Text } from '@chakra-ui/react';
import { Chain } from '@thorswap-lib/types';
import { Box, Button } from 'components/Atomic';
import { StepActions } from 'components/Stepper';
import { useStepper } from 'components/Stepper/StepperContext';
import { useCallback, useEffect } from 'react';
import { t } from 'services/i18n';
import { Signer } from 'services/multisig';
import { useWallet } from 'store/wallet/hooks';
import { CurrentSignerItem } from 'views/Multisig/components/CurrentSignerItem';

type Props = {
  handleSign: () => void;
  connectedSignature: Signer | null;
};

export function SignTxStep({ handleSign, connectedSignature }: Props) {
  const { wallet, setIsConnectModalOpen } = useWallet();
  const { nextStep } = useStepper();
  // const [isImportModalOpened, setIsImportModalOpened] = useState(false)

  const connectedWalletAddress = wallet?.[Chain.THORChain]?.address || '';

  const handleSignClick = useCallback(() => {
    if (!connectedWalletAddress) {
      setIsConnectModalOpen(true);
      return;
    }

    handleSign();
  }, [connectedWalletAddress, setIsConnectModalOpen, handleSign]);

  useEffect(() => {
    if (connectedSignature) {
      nextStep();
    }
  }, [connectedSignature, nextStep]);

  return (
    <Box col className="self-stretch mx-2" flex={1}>
      <Box col className="gap-2">
        <Text fontWeight="normal" textStyle="caption">
          {t('views.multisig.addYourSignatureInfo')}
        </Text>
        {!connectedSignature ? (
          <Button stretch onClick={handleSignClick} variant="primary">
            {connectedWalletAddress ? t('views.multisig.signTx') : t('common.connectWallet')}
          </Button>
        ) : (
          <CurrentSignerItem
            pubKey={connectedSignature.pubKey}
            signature={connectedSignature.signature}
          />
        )}
      </Box>

      {/* <Box className="gap-2 mt-6" col>
        <Typography variant="caption" fontWeight="normal">
          {t('views.multisig.importSignatureInfo')}
        </Typography>
        <Button
          variant="secondary"
          stretch
          onClick={() => setIsImportModalOpened(true)}
        >
          {t('views.multisig.importSignature')}
        </Button>
      </Box> */}

      <StepActions backHidden />

      {/* <ImportSignatureModal
        isOpened={isImportModalOpened}
        onClose={() => setIsImportModalOpened(false)}
        onSubmit={(signature) => {
          setIsImportModalOpened(false)
          addSigner(signature)
        }}
      /> */}
    </Box>
  );
}
