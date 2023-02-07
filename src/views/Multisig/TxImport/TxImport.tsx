import classNames from 'classnames';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { FieldLabel } from 'components/Form';
import { HoverIcon } from 'components/HoverIcon';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { FilePicker } from 'react-file-picker';
import { t } from 'services/i18n';
import { useTxImportForm } from 'views/Multisig/TxImport/hooks';

const TxImport = () => {
  const { onChangeFile, fileError, onError, isValid, importedTx, handleImportTx } =
    useTxImportForm();

  return (
    <PanelView
      header={<ViewHeader withBack title={t('views.multisig.importTransaction')} />}
      title={t('views.multisig.importTransaction')}
    >
      <Box col className="self-stretch">
        <Box className="pb-8">
          <Typography>{t('views.multisig.selectTxJsonFile')}</Typography>
          <HoverIcon
            color="secondary"
            iconName="infoCircle"
            tooltip={t('views.multisig.thorsafeFileTooltip')}
          />
        </Box>
        <FieldLabel hasError={!!fileError} label={t('views.multisig.chooseFileToUpload')} />
        <FilePicker onChange={onChangeFile} onError={onError}>
          <Box
            alignCenter
            className="h-10 px-3 border border-solid cursor-pointer rounded-2xl border-light-border-primary dark:border-dark-border-primary hover:border-light-typo-gray dark:hover:border-dark-typo-gray"
          >
            {!importedTx && !fileError && <Icon name="upload" size={18} />}
            {importedTx && !fileError && <Icon color="green" name="valid" size={18} />}
            {fileError && <Icon color="red" name="invalid" size={18} />}
            <Typography
              className={classNames('text-[11px] opacity-80 ml-2', {
                'opacity-100': importedTx && !fileError,
              })}
              fontWeight="semibold"
              variant="caption-xs"
            >
              {t('views.walletModal.chooseKeystore')}
            </Typography>
          </Box>
        </FilePicker>
      </Box>

      <Box center className="w-full pt-5">
        <Button stretch disabled={!isValid} onClick={handleImportTx} size="lg" variant="fancy">
          {t('views.multisig.importTransaction')}
        </Button>
      </Box>
    </PanelView>
  );
};

export default TxImport;
