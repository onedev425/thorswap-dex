import classNames from 'classnames';
import { Box, Button, Card, Typography } from 'components/Atomic';
import { baseBorderClass, borderHoverHighlightClass } from 'components/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { t } from 'services/i18n';
import { ROUTES } from 'settings/router';
import { MultisigModal } from 'views/Multisig/MultisigModal/MultisigModal';
import { PubKeyInfo } from 'views/Multisig/PubKeyInfo';

export const MultisigCreateTile = () => {
  const navigate = useNavigate();
  const [isMultisigModalOpened, setMultisigModalOpened] = useState(false);

  return (
    <Box col>
      <Card className={classNames(borderHoverHighlightClass, baseBorderClass)}>
        <Box col className="gap-6">
          <Typography variant="subtitle1">{t('views.multisig.createThorsafe')}</Typography>
          <Box col className="gap-10">
            <Box col flex={1}>
              <Typography className="my-3" fontWeight="light">
                {t('views.multisig.createMultisigDescription')}
              </Typography>

              <PubKeyInfo />
            </Box>

            <Box col flex={1}>
              <Typography variant="subtitle1">Get started</Typography>
              <Typography className="my-3" fontWeight="light">
                {t('views.multisig.createMultisigStart')}
              </Typography>
              <Button
                stretch
                className="mt-3"
                onClick={() => navigate(ROUTES.MultisigCreate)}
                variant="secondary"
              >
                {t('views.multisig.createThorSafeWallet')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Card>
      <MultisigModal
        isOpen={isMultisigModalOpened}
        onCancel={() => setMultisigModalOpened(false)}
      />
    </Box>
  );
};
