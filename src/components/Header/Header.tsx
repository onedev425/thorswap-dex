import classNames from 'classnames'

import { Button } from 'components/Button'
import { genericBgClasses } from 'components/constants'
import { DropdownMenu, DropdownMenuItems } from 'components/Dropdown'
import { Icon } from 'components/Icon'
import { Row } from 'components/Row'
import { ThemeSwitch } from 'components/ThemeSwitch/ThemeSwitch'

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
    <Row
      className={classNames(
        'mb-10 px-4 flex flex-row min-h-[70px] bg-white flex-1 items-center justify-between',
        genericBgClasses.primary,
      )}
    >
      <Row className="gap-x-4">
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
          startIcon={<Icon className="mr-2" name="gwei" />}
        >
          {gweiLabel || '-'}
        </Button>
        <DropdownMenu
          menuItems={currencyOptions}
          value={currency}
          onChange={selectCurrency}
        />
      </Row>
      <Row className="gap-x-2 md:gap-x-6">
        <Button outline onClick={connectWallet}>
          Connect Wallet
        </Button>
        <Icon name="refresh" color="secondary" size={18} onClick={refresh} />
        <Icon name="menu" color="secondary" size={18} onClick={openDrawer} />
      </Row>
    </Row>
  )
}
