import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, Card } from 'components/Atomic';
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
          <Text textStyle="subtitle1">{t('views.multisig.addMultisigWallet')}</Text>
          <Box col>
            <Text className="my-3" fontWeight="light">
              {t('views.multisig.importMultisigDescription')}
            </Text>
            <Text className="my-3" fontWeight="light">
              {t('views.multisig.importMultisigSecondDescription')}
            </Text>
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
