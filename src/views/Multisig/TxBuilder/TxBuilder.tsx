import { Box, Button, Link, Typography } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import { InfoTable } from 'components/InfoTable';
import { PanelView } from 'components/PanelView';
import { ViewHeader } from 'components/ViewHeader';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/constants';
import { useAppSelector } from 'store/store';
import { useMultisigWalletInfo } from 'views/Multisig/hooks';

const TxBuilder = () => {
  const info = useMultisigWalletInfo();
  const hasConnectedMultisig = useAppSelector((state) => !!state.multisig.address);

  return (
    <PanelView
      header={<ViewHeader title={t('views.multisig.transactionBuilder')} />}
      title={t('views.multisig.transactionBuilder')}
    >
      <Box col className="w-full gap-6 my-4">
        {hasConnectedMultisig && <InfoTable horizontalInset items={info} size="lg" />}
        <Box className="gap-5 flex-col sm:flex-row">
          <HighlightCard className="sm:w-full p-3">
            <Typography variant="caption">{t('views.multisig.newTransaction')}</Typography>
            <Typography className="my-3" fontWeight="medium" variant="caption-xs">
              {t('views.multisig.newTransactionDescription')}
            </Typography>
            {hasConnectedMultisig ? (
              <Link to={ROUTES.TxCreate}>
                <Button stretch variant="primary">
                  {t('views.multisig.createTransaction')}
                </Button>
              </Link>
            ) : (
              <Button
                disabled
                stretch
                tooltip={t('views.multisig.createTxDisabledInfo')}
                variant="primary"
              >
                {t('views.multisig.createTransaction')}
              </Button>
            )}
          </HighlightCard>
          <HighlightCard className="sm:w-full p-3">
            <Typography variant="caption">{t('views.multisig.importTransaction')}</Typography>
            <Typography className="my-3" fontWeight="medium" variant="caption-xs">
              {t('views.multisig.importTransactionDescription')}
            </Typography>
            <Link to={ROUTES.TxImport}>
              <Button stretch variant="secondary">
                {t('views.multisig.importTransaction')}
              </Button>
            </Link>
          </HighlightCard>
        </Box>
      </Box>
    </PanelView>
  );
};

export default TxBuilder;
