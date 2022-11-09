import classNames from 'classnames';
import { Box, Button, Card, Typography } from 'components/Atomic';
import { baseBorderClass, borderHoverHighlightClass } from 'components/constants';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';

export const MultisigImportTile = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Card className={classNames(borderHoverHighlightClass, baseBorderClass)}>
        <Box col className="gap-6">
          <Typography variant="subtitle1">{t('views.multisig.addMultisigWallet')}</Typography>
          <Box col>
            <Typography className="my-3" fontWeight="light">
              {t('views.multisig.importMultisigDescription')}
            </Typography>
            <Typography className="my-3" fontWeight="light">
              {t('views.multisig.importMultisigSecondDescription')}
            </Typography>
          </Box>
          <Box align="end" className="mt-8" flex={1}>
            <Button stretch onClick={() => navigate(ROUTES.MultisigConnect)} variant="primary">
              {t('views.multisig.connectMyThorsafe')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
