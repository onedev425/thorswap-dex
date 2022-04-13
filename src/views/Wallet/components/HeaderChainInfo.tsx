import { ChainWallet, SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { Box, Typography } from 'components/Atomic'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

type Props = {
  chain: SupportedChain
  chainWallet: Maybe<ChainWallet>
  balance: string
}

export const HeaderChainInfo = ({ chain, chainWallet, balance }: Props) => {
  return (
    <Box center className="space-x-1">
      {!!chainWallet && (
        <WalletIcon walletType={chainWallet?.walletType} size={16} />
      )}
      <Typography>{chainToString(chain)}</Typography>

      {!!chainWallet && (
        <Typography color="primaryBtn" fontWeight="semibold">
          {balance}
        </Typography>
      )}
    </Box>
  )
}
