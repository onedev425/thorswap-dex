import { Text } from '@chakra-ui/react';
import type { Keystore } from '@swapkit/wallet-keystore';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { Input } from 'components/Input';
import { ConfirmKeystorePhrase } from 'components/Modals/ConnectWalletModal/ConfirmKeystorePhrase';
import { downloadAsFile } from 'helpers/download';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';

type Props = {
  onConnect: (keystore: Keystore, phrase: string) => void;
  onKeystore: () => void;
};

export const CreateKeystoreView = ({ onConnect, onKeystore }: Props) => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [keystoreCopyConfirmed, setKeystoreCopyConfirmed] = useState(false);
  const [phrase, setPhrase] = useState('');

  const ready = useMemo(
    () => password.length > 0 && password === confirmPassword,
    [password, confirmPassword],
  );

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setInvalidStatus(false);
  }, []);

  const handleConfirmPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setConfirmPassword(e.target.value);
      if (password !== e.target.value) {
        setInvalidStatus(true);
      } else {
        setInvalidStatus(false);
      }
    },
    [password],
  );

  const handleCreate = useCallback(async () => {
    if (ready) {
      setProcessing(true);
      const { generatePhrase } = await import('@swapkit/wallet-keystore');

      try {
        const newPhrase = generatePhrase();
        setPhrase(newPhrase);
      } catch (error) {
        setInvalidStatus(true);
        console.error(error);
      }
      setProcessing(false);
    }
  }, [ready]);

  const handleCreationConfirm = useCallback(async () => {
    if (ready && phrase) {
      setProcessing(true);
      const { encryptToKeyStore } = await import('@swapkit/wallet-keystore');

      try {
        const keystore = await encryptToKeyStore(phrase, password);
        downloadAsFile('thorswap-keystore.txt', JSON.stringify(keystore));
        onConnect(keystore, phrase);

        // clean up
        setPassword('');
        setConfirmPassword('');
        setPhrase('');
      } catch (error) {
        setInvalidStatus(true);
        console.error(error);
      }
      setProcessing(false);
    }
  }, [ready, phrase, password, onConnect]);

  const handleKeypress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        handleCreate();
      }
    },
    [handleCreate],
  );

  useEffect(() => {
    if (keystoreCopyConfirmed && phrase) {
      handleCreationConfirm();
    }
  }, [handleCreationConfirm, keystoreCopyConfirmed, phrase]);

  if (phrase) {
    return (
      <ConfirmKeystorePhrase onConfirm={() => setKeystoreCopyConfirmed(true)} phrase={phrase} />
    );
  }

  return (
    <Box col className="w-full">
      <Helmet content="Create Wallet" title="Create Wallet" />
      <Box row className="space-x-2">
        <Text className="mb-2" fontWeight="semibold" textStyle="subtitle2">
          {t('views.walletModal.inputPassword')}
        </Text>
        <Tooltip
          content={t('views.walletModal.recoveryPassword')}
          iconName="question"
          place="top"
        />
      </Box>
      <Box className="w-full">
        <Input
          stretch
          border="rounded"
          name="password"
          onChange={handlePasswordChange}
          onKeyDown={handleKeypress}
          placeholder={t('views.walletModal.enterPassword')}
          type="password"
          value={password}
        />
      </Box>
      <Box row className="space-x-2 mt-6 mb-2">
        <Text textStyle="subtitle2">{t('views.walletModal.confirmPassword')}</Text>
      </Box>
      <Box className="w-full">
        <Input
          stretch
          border="rounded"
          name="password"
          onChange={handleConfirmPasswordChange}
          onKeyDown={handleKeypress}
          placeholder={t('views.walletModal.confirmPassword')}
          type="password"
          value={confirmPassword}
        />
      </Box>
      {invalidStatus && (
        <Text className="mt-2 ml-3" textStyle="caption" variant="orange">
          {t('views.walletModal.wrongPassword')}
        </Text>
      )}

      <Box className="gap-x-4 mt-6">
        <Button
          className="flex-1 group"
          disabled={!ready}
          loading={processing}
          onClick={handleCreate}
          rightIcon={
            <Icon className="transition dark:group-hover:text-white" name="key" size={18} />
          }
          size="sm"
        >
          {t('common.create')}
        </Button>

        <Button
          className="flex-1 group"
          onClick={onKeystore}
          rightIcon={<Icon name="wallet" size={18} />}
          size="sm"
          variant="outlineTint"
        >
          {t('views.walletModal.connectWallet')}
        </Button>
      </Box>
    </Box>
  );
};
