import { encryptToKeyStore, validatePhrase } from '@thorswap-lib/xchain-crypto';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { Helmet } from 'components/Helmet';
import { Input } from 'components/Input';
import { downloadAsFile } from 'helpers/download';
import { ChangeEvent, useCallback, useState } from 'react';
import { t } from 'services/i18n';

export const PhraseView = () => {
  const [phrase, setPhrase] = useState('');
  const [invalidPhrase, setInvalidPhrase] = useState(false);

  const [password, setPassword] = useState<string>('');
  const [invalidStatus, setInvalidStatus] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handlePasswordChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setInvalidStatus(false);
  }, []);

  const handlePhraseChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInvalidPhrase(false);
    setPhrase(e.target.value);
  }, []);

  const handleBackupKeystore = useCallback(async () => {
    if (phrase && password) {
      setProcessing(true);

      try {
        const isValidPhrase = validatePhrase(phrase);

        if (!isValidPhrase) {
          setInvalidPhrase(true);
          setProcessing(false);
          return;
        }

        const keystore = await encryptToKeyStore(phrase, password);

        downloadAsFile('thorswap-keystore.txt', JSON.stringify(keystore));

        // clean up
        setPassword('');
        setPhrase('');
      } catch (error) {
        setInvalidStatus(true);
        console.error(error);
      }
      setProcessing(false);
    }
  }, [phrase, password]);

  const ready = password.length > 0 && !invalidPhrase && !processing;

  return (
    <Box col className="w-full">
      <Helmet
        content={t('views.walletModal.importPhrase')}
        title={t('views.walletModal.importPhrase')}
      />
      <Box row className="space-x-2">
        <Typography className="mb-2" fontWeight="semibold" variant="subtitle2">
          {t('views.walletModal.enterSeed')}
        </Typography>
      </Box>
      <Box className="w-full">
        <Input
          stretch
          border="rounded"
          name="phrase"
          onChange={handlePhraseChange}
          placeholder={t('views.walletModal.phrase')}
          value={phrase}
        />
      </Box>
      {invalidPhrase && (
        <Typography className="mt-2 ml-3" color="red" variant="caption">
          {t('views.walletModal.invalidPhrase')}
        </Typography>
      )}
      <Box row className="space-x-2 mt-6 mb-2">
        <Typography variant="subtitle2">{t('views.walletModal.keystorePassword')}</Typography>
      </Box>
      <Box className="w-full">
        <Input
          stretch
          border="rounded"
          disabled={!phrase}
          name="password"
          onChange={handlePasswordChange}
          placeholder={t('views.walletModal.confirmPassword')}
          type="password"
          value={password}
        />
      </Box>
      {invalidStatus && (
        <Typography className="mt-2 ml-3" color="red" variant="caption">
          {t('common.defaultErrMsg')}
        </Typography>
      )}

      <Box className="mt-6">
        <Button
          className="flex-1 group"
          disabled={!ready}
          endIcon={<Icon className="transition group-hover:text-white" name="backup" size={18} />}
          loading={processing}
          onClick={handleBackupKeystore}
          size="sm"
        >
          {t('views.walletModal.backupKeystore')}
        </Button>
      </Box>
    </Box>
  );
};
