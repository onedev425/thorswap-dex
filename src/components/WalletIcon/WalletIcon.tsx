import { WalletOption } from '@thorswap-lib/multichain-sdk'

import { Box, Icon, IconName, Tooltip } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

import { t } from 'services/i18n'

type Props = {
  className?: string
  walletType: WalletOption
  size?: number
  onClick?: () => void
  tooltipDisabled?: boolean
}

const walletIcons: Record<WalletOption, IconName> = {
  [WalletOption.METAMASK]: 'metamask',
  [WalletOption.LEDGER]: 'ledger',
  [WalletOption.KEYSTORE]: 'keystore',
  [WalletOption.ONBOARD]: 'eth',
  [WalletOption.TRUSTWALLET]: 'walletConnect',
  [WalletOption.XDEFI]: 'xdefi',
  [WalletOption.TERRASTATION]: 'terra',
}

export const WalletIcon = ({
  className,
  walletType,
  size,
  tooltipDisabled,
  onClick,
}: Props) => {
  const tooltipContent =
    walletType === WalletOption.KEYSTORE
      ? t('views.walletModal.viewPhrase')
      : t('views.wallet.walletTypeConnected', {
          walletType,
        })

  return (
    <Tooltip content={tooltipContent} disabled={tooltipDisabled}>
      <Box onClick={onClick} className={onClick ? baseHoverClass : className}>
        <Icon name={walletIcons[walletType]} size={size} />
      </Box>
    </Tooltip>
  )
}
