import { Keystore } from '@thorswap-lib/types';
import { encryptToKeyStore, generatePhrase, validatePhrase } from '@thorswap-lib/xchain-crypto';
import { Box, Button, Icon, Tooltip, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { Input } from 'components/Input';
import { downloadAsFile } from 'helpers/download';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
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

      try {
        const phrase = generatePhrase();
        const isValid = validatePhrase(phrase);
        if (!isValid) {
          return;
        }

        const keystore = await encryptToKeyStore(phrase, password);

        downloadAsFile('thorswap-keystore.txt', JSON.stringify(keystore));

        // clean up
        setPassword('');
        setConfirmPassword('');

        onConnect(keystore, phrase);
      } catch (error) {
        setInvalidStatus(true);
        console.error(error);
      }
      setProcessing(false);
    }
  }, [ready, password, onConnect]);

  const handleKeypress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.code === 'Enter') {
        handleCreate();
      }
    },
    [handleCreate],
  );

  return (
    <Box col className="w-full">
      <Helmet content="Create Wallet" title="Create Wallet" />
      <Box row className="space-x-2">
        <Typography className="mb-2" fontWeight="semibold" variant="subtitle2">
          {t('views.walletModal.inputPassword')}
        </Typography>
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
        <Typography variant="subtitle2">{t('views.walletModal.confirmPassword')}</Typography>
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
        <Typography className="mt-2 ml-3" color="orange" variant="caption">
          {t('views.walletModal.wrongPassword')}
        </Typography>
      )}

      <Box className="gap-x-4 mt-6">
        <Button
          className="flex-1 group"
          disabled={!ready}
          endIcon={<Icon className="transition dark:group-hover:text-white" name="key" size={18} />}
          loading={processing}
          onClick={handleCreate}
          size="sm"
        >
          {t('common.create')}
        </Button>

        <Button
          className="flex-1 group"
          endIcon={<Icon name="wallet" size={18} />}
          onClick={onKeystore}
          size="sm"
          type="outline"
          variant="tint"
        >
          {t('views.walletModal.connectWallet')}
        </Button>
      </Box>
    </Box>
  );
};
