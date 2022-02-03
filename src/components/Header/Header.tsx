import { Button } from 'components/Button'
import { DropdownMenu, DropdownMenuItems } from 'components/Dropdown'
import { Icon } from 'components/Icon'
import { Row } from 'components/Row'
import { ThemeSwitch } from 'components/Theme'

type Props = {
  currencyOptions: DropdownMenuItems
  priceLabel: string
  gweiLabel: string
  currency: string
  selectCurrency: (value: string) => void
  refresh: () => void
  openDrawer: () => void
  connectWallet: () => void
}

export const Header = ({
  currencyOptions,
  currency,
  priceLabel,
  gweiLabel,
  selectCurrency,
  refresh,
  openDrawer,
  connectWallet,
}: Props) => {
  return (
    <header className="mb-10">
      <Row className="min-h-[70px]" justify="between">
        <Row className="mt-auto shrink-0 gap-x-4">
          <ThemeSwitch />
          <Button
            className="hidden cursor-auto md:flex hover:bg-transparent dark:hover:bg-transparent"
            outline
            bgColor="tertiary"
          >
            {priceLabel || '-'}
          </Button>

          <Button
            className="hidden cursor-auto md:flex hover:bg-transparent dark:hover:bg-transparent"
            outline
            bgColor="tertiary"
            startIcon={<Icon className="mr-2" name="gwei" size={18} />}
          >
            {gweiLabel || '-'}
          </Button>
          <DropdownMenu
            menuItems={currencyOptions}
            value={currency}
            onChange={selectCurrency}
          />
        </Row>
        <Row className="inline-flex items-center mt-auto shrink-0 gap-x-4">
          <Button outline onClick={connectWallet}>
            Connect Wallet
          </Button>
          <Icon name="refresh" color="secondary" size={18} onClick={refresh} />
          <Icon name="menu" color="secondary" size={18} onClick={openDrawer} />
        </Row>
      </Row>
    </header>
  )
}
