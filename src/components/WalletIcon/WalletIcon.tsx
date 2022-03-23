import { WalletOption } from '@thorswap-lib/multichain-sdk'

import { Box, Icon, IconName } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

type Props = {
  walletType: WalletOption
  size?: number
  onClick?: () => void
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

export const WalletIcon = ({ walletType, size, onClick }: Props) => {
  return (
    <Box onClick={onClick} className={baseHoverClass}>
      <Icon name={walletIcons[walletType]} size={size} />
    </Box>
  )
}
