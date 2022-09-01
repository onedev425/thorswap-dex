import classNames from 'classnames';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { Input } from 'components/Input';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { useCallback } from 'react';
import { FilePicker } from 'react-file-picker';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/constants';
import { useMultisigImport } from 'views/Multisig/MultisigImport/hooks';

const MultisigImport = () => {
  const navigate = useNavigate();
  const onSuccess = useCallback(() => navigate(ROUTES.Multisig), [navigate]);
  const {
    onChangeFile,
    fileError,
    onError,
    name,
    setName,
    handleConnectWallet,
    isValid,
    walletData,
  } = useMultisigImport({ onSuccess });

  return (
    <PanelView
      header={<ViewHeader withBack title={t('views.multisig.connectThorSafeWallet')} />}
      title={t('views.multisig.thorSafeWallet')}
    >
      <Box col className="self-stretch gap-8">
        <Typography>{t('views.multisig.selectWalletJson')}</Typography>

        <Box col className="gap-8">
          <Box col>
            <FieldLabel hasError={!!fileError} label={t('views.multisig.selectFile')} />
            <FilePicker onChange={onChangeFile} onError={onError}>
              <Box
                alignCenter
                className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
              >
                {!walletData && !fileError && <Icon name="upload" size={18} />}
                {walletData && !fileError && <Icon color="green" name="valid" size={18} />}
                {fileError && <Icon color="red" name="invalid" size={18} />}
                <Typography
                  className={classNames('text-[11px] opacity-80 ml-2', {
                    'opacity-100': walletData && !fileError,
                  })}
                  fontWeight="semibold"
                  variant="caption-xs"
                >
                  {t('views.walletModal.chooseKeystore')}
                </Typography>
              </Box>
            </FilePicker>
            {!!fileError && (
              <Box className="my-1 mx-2">
                <Typography color="red" fontWeight="normal" variant="caption">
                  {fileError}
                </Typography>
              </Box>
            )}
          </Box>

          <Box col>
            <FieldLabel label={t('views.multisig.thorSafeName')} />
            <Input
              stretch
              border="rounded"
              className="py-1"
              onChange={(e) => setName(e.target.value)}
              placeholder={t('views.multisig.nameExample')}
              value={name}
            />
          </Box>
        </Box>

        <Box center className="w-full pt-5">
          <Button
            isFancy
            stretch
            disabled={!isValid}
            error={!!fileError}
            onClick={handleConnectWallet}
            size="lg"
          >
            {t('common.connect')}
          </Button>
        </Box>
      </Box>
    </PanelView>
  );
};

export default MultisigImport;
