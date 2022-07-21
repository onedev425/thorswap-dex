import { useState } from 'react'

import classNames from 'classnames'

import { MultisigModal } from 'views/Multisig/MultisigModal/MultisigModal'

import { Box, Button, Card, Typography } from 'components/Atomic'
import {
  borderHoverHighlightClass,
  baseBorderClass,
} from 'components/constants'

import { t } from 'services/i18n'

export const MultisigCreate = () => {
  const [isMultisigModalOpened, setMultisigModalOpened] = useState(false)

  return (
    <Box col>
      <Card className={classNames(borderHoverHighlightClass, baseBorderClass)}>
        <Box className="gap-5" col>
          <Typography variant="subtitle1">
            {t('views.multisig.multisigModalTitle')}
          </Typography>
          <Typography className="my-3" fontWeight="light">
            {t('views.multisig.createMultisigDescription')}
          </Typography>

          <Typography className="my-3" fontWeight="semibold">
            NOTE: You will need your public key in order to create multisig
            wallet
          </Typography>

          <Box flex={1}>
            <Button
              stretch
              variant="secondary"
              onClick={() => setMultisigModalOpened(true)}
            >
              {t('views.multisig.multisigModalTitle')}
            </Button>
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
