import { WalletOption } from '@thorswap-lib/multichain-sdk'

import { Box, Icon, IconName } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'

type Props = {
  walletType: WalletOption
  size?: number
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

export const WalletIcon = ({ walletType, size }: Props) => {
  return (
    <Box className={baseHoverClass}>
      <Icon name={walletIcons[walletType]} size={size} />
    </Box>
  )
}
