import { useCallback, useMemo, useState } from 'react'

import { WalletOption } from '@thorswap-lib/multichain-sdk'
import { chainToString, Chain } from '@thorswap-lib/xchain-util'
import copy from 'copy-to-clipboard'

import { Box, Icon, Typography } from 'components/Atomic'

// import { multichain } from 'services/multichain'

export type ChainHeaderProps = {
  chain: Chain
  address: string
  totalPrice?: string
  onReload?: () => void
  viewPhrase?: () => void
  walletLoading?: boolean
  walletType: WalletOption
}

type QrCodeData = {
  chain: string
  address: string
}

export const ChainHeader = (props: ChainHeaderProps) => {
  const {
    chain,
    address,
    // walletType,
    // viewPhrase = () => {},
    onReload,
    // walletLoading = false,
  } = props

  const [, setQrcode] = useState<QrCodeData>()

  const miniAddress = useMemo(
    () => `${address.slice(0, 3)}...${address.slice(-3)}`,
    [address],
  )

  // const accountUrl = useMemo(
  //   () => multichain.getExplorerAddressUrl(chain, address),
  //   [chain, address],
  // )

  const handleCopyAddress = useCallback(() => {
    copy(address)

    // TODO: show notification
  }, [address])

  const handleViewQRCode = useCallback(
    (text: string) => {
      setQrcode({
        chain: chainToString(chain),
        address: text,
      })
    },
    [chain],
  )

  // const handleClickWalletIcon = useCallback(async () => {
  //   if (walletType === WalletOption.KEYSTORE) {
  //     viewPhrase()
  //   }

  //   if (walletType === WalletOption.LEDGER && chain === 'THOR') {
  //     // const addr = await multichain.thor.verifyLedgerAddress()
  //     // TODO: show notification to verify ledger address
  //   }
  // }, [viewPhrase, walletType, chain])

  // const walletTooltip = useMemo(() => {
  //   if (walletType === WalletOption.KEYSTORE) {
  //     return 'View Phrase'
  //   }
  //   if (walletType === WalletOption.LEDGER) {
  //     return 'Verify Address'
  //   }

  //   return `${walletType} Connected`
  // }, [walletType])

  return (
    <Box
      className="p-2 bg-btn-light-tint dark:bg-btn-dark-tint"
      justify="between"
    >
      <Box alignCenter>
        <Icon name="refresh" color="secondary" size={16} onClick={onReload} />
        <Typography className="ml-2">{chainToString(chain)}</Typography>
      </Box>
      <Box className="space-x-2" alignCenter>
        <Typography variant="caption" fontWeight="semibold">
          {miniAddress}
        </Typography>
        <Icon
          className=""
          name="copy"
          color="secondary"
          size={18}
          onClick={handleCopyAddress}
        />
        <Icon
          name="qrcode"
          color="secondary"
          size={18}
          onClick={() => handleViewQRCode(address)}
        />
        <Icon name="external" color="secondary" size={18} />
      </Box>
    </Box>
  )
}
