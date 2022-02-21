import { AppPopoverMenu } from 'components/AppPopoverMenu'
import { Button } from 'components/Button'
import { Icon } from 'components/Icon'
import { Row } from 'components/Row'

import { t } from 'services/i18n'

type Props = {
  priceLabel: string
  gweiLabel: string
  openDrawer: () => void
  connectWallet: () => void
}

export const Header = ({
  priceLabel,
  gweiLabel,
  // openDrawer,
  connectWallet,
}: Props) => {
  return (
    <header className="mb-5">
      <Row className="min-h-[70px]" justify="between">
        <Row className="mt-auto shrink-0 gap-x-4">
          <Button
            className="hidden cursor-auto md:flex"
            type="outline"
            variant="tint"
          >
            {priceLabel || '-'}
          </Button>

          <Button
            className="hidden cursor-auto md:flex"
            type="outline"
            variant="tint"
            startIcon={<Icon className="mr-2" name="gwei" size={18} />}
          >
            {gweiLabel || '-'}
          </Button>
        </Row>
        <Row className="inline-flex items-center mt-auto shrink-0 gap-x-4">
          <Button type="outline" onClick={connectWallet}>
            {t('common.connectWallet')}
          </Button>
          <AppPopoverMenu />
        </Row>
      </Row>
    </header>
  )
}
