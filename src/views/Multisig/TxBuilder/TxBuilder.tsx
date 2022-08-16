import { useMultisigWalletInfo } from 'views/Multisig/hooks'

import { Box, Button, Link, Typography } from 'components/Atomic'
import { HighlightCard } from 'components/HighlightCard'
import { InfoTable } from 'components/InfoTable'
import { PanelView } from 'components/PanelView'
import { ViewHeader } from 'components/ViewHeader'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

const TxBuilder = () => {
  const info = useMultisigWalletInfo()

  return (
    <PanelView
      title={t('views.multisig.transactionBuilder')}
      header={<ViewHeader title={t('views.multisig.transactionBuilder')} />}
    >
      <Box className="w-full gap-6 my-4" col>
        <InfoTable items={info} size="lg" horizontalInset />
        <Box className="gap-5 flex-col sm:flex-row">
          <HighlightCard className="sm:w-full p-3">
            <Typography variant="caption">
              {t('views.multisig.newTransaction')}
            </Typography>
            <Typography
              className="my-3"
              variant="caption-xs"
              fontWeight="medium"
            >
              {t('views.multisig.newTransactionDescription')}
            </Typography>
            <Link to={ROUTES.TxCreate}>
              <Button stretch variant="primary">
                {t('views.multisig.createTransaction')}
              </Button>
            </Link>
          </HighlightCard>
          <HighlightCard className="sm:w-full p-3">
            <Typography variant="caption">
              {t('views.multisig.importTransaction')}
            </Typography>
            <Typography
              className="my-3"
              variant="caption-xs"
              fontWeight="medium"
            >
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
  )
}

export default TxBuilder
