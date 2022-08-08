import { useState } from 'react'

import { useNavigate } from 'react-router'

import classNames from 'classnames'

import { MultisigModal } from 'views/Multisig/MultisigModal/MultisigModal'
import { PubKeyInfo } from 'views/Multisig/PubKeyInfo'

import { Box, Button, Card, Typography } from 'components/Atomic'
import {
  borderHoverHighlightClass,
  baseBorderClass,
} from 'components/constants'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const MultisigCreateTile = () => {
  const navigate = useNavigate()
  const [isMultisigModalOpened, setMultisigModalOpened] = useState(false)

  return (
    <Box col>
      <Card className={classNames(borderHoverHighlightClass, baseBorderClass)}>
        <Box col className="gap-6">
          <Typography variant="subtitle1">
            {t('views.multisig.multisigModalTitle')}
          </Typography>
          <Box className="gap-10" col>
            <Box flex={1} col>
              <Typography className="my-3" fontWeight="light">
                {t('views.multisig.createMultisigDescription')}
              </Typography>

              <PubKeyInfo />
            </Box>

            <Box flex={1} col>
              <Typography variant="subtitle1">{'Get started'}</Typography>
              <Typography className="my-3" fontWeight="light">
                {t('views.multisig.createMultisigStart')}
              </Typography>
              <Button
                className="mt-3"
                stretch
                variant="secondary"
                onClick={() => navigate(ROUTES.MultisigCreate)}
              >
                {t('views.multisig.multisigModalTitle')}
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
  )
}
