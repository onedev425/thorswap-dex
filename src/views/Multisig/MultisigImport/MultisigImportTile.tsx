import { useNavigate } from 'react-router-dom'

import classNames from 'classnames'

import { Box, Button, Card, Typography } from 'components/Atomic'
import {
  borderHoverHighlightClass,
  baseBorderClass,
} from 'components/constants'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const MultisigImportTile = () => {
  const navigate = useNavigate()

  return (
    <Box>
      <Card className={classNames(borderHoverHighlightClass, baseBorderClass)}>
        <Box className="gap-6" col>
          <Typography variant="subtitle1">
            {t('views.multisig.addMultisigWallet')}
          </Typography>
          <Typography className="my-3" fontWeight="light">
            {t('views.multisig.importMultisigDescription')}
          </Typography>

          <Box className="mt-8" flex={1} align="end">
            <Button
              stretch
              variant="primary"
              onClick={() => navigate(ROUTES.MultisigConnect)}
            >
              {t('views.multisig.connectExistingWallet')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
