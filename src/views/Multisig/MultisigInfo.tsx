import classNames from 'classnames'

import { useMultisigWalletInfo } from 'views/Multisig/hooks'

import { Box, Button, Card, Link } from 'components/Atomic'
import {
  borderHoverHighlightClass,
  baseBorderClass,
} from 'components/constants'
import { InfoTable } from 'components/InfoTable'

import { t } from 'services/i18n'

import { ROUTES } from 'settings/constants'

export const MultisigInfo = () => {
  const info = useMultisigWalletInfo()

  return (
    <Card
      className={classNames(
        borderHoverHighlightClass,
        baseBorderClass,
        'flex-1',
      )}
    >
      <Box className="gap-5" col flex={1}>
        <InfoTable items={info} size="lg" horizontalInset />

        <Box className="mt-8" flex={1}>
          <Link className="flex-1" to={ROUTES.TxBuilder}>
            <Button stretch variant="primary" onClick={() => {}}>
              {t('views.multisig.newTransaction')}
            </Button>
          </Link>
        </Box>
      </Box>
    </Card>
  )
}
