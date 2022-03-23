import { useCallback, useMemo, useState } from 'react'

import { SupportedChain, WalletOption } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'
import classNames from 'classnames'

import { useWalletDrawerActions } from 'views/WalletBalance/hooks/useWalletDrawerActions'

import { Box, Icon, Tooltip, Typography } from 'components/Atomic'
import { baseHoverClass } from 'components/constants'
import { QRCodeModal } from 'components/Modals/QRCodeModal'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import { useAddressUtils } from 'hooks/useAddressUtils'

import { multichain } from 'services/multichain'

export type ChainHeaderProps = {
  chain: SupportedChain
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

const EMPTY_QR_DATA = { chain: '', address: '' }

export const ChainHeader = (props: ChainHeaderProps) => {
  const {
    chain,
    address,
    walletType,
    // viewPhrase = () => {},
    walletLoading = false,
  } = props

  const { handleRefreshChain } = useWalletDrawerActions()
  const { handleCopyAddress, miniAddress } = useAddressUtils(address)

  const [qrData, setQrData] = useState<QrCodeData>(EMPTY_QR_DATA)

  const handleViewQRCode = useCallback(() => {
    setQrData({
      chain: chainToString(chain),
      address,
    })
  }, [chain, address])

  const accountUrl = useMemo(
    () => multichain.getExplorerAddressUrl(chain, address),
    [chain, address],
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

  const walletTooltip = useMemo(() => {
    if (walletType === WalletOption.KEYSTORE) {
      return 'View Phrase'
    }
    if (walletType === WalletOption.LEDGER) {
      return 'Verify Address'
    }

    return `${walletType} Connected`
  }, [walletType])

  return (
    <Box
      className="py-2 px-4 bg-btn-light-tint dark:bg-btn-dark-tint"
      justify="between"
    >
      <Box alignCenter>
        <Tooltip content="Refresh">
          <Box
            onClick={() => handleRefreshChain(chain)}
            className={baseHoverClass}
          >
            <Icon
              className={classNames({ '!animate-spin': walletLoading })}
              name="refresh"
              color="secondary"
              size={16}
            />
          </Box>
        </Tooltip>
        <Tooltip content={walletTooltip}>
          <WalletIcon walletType={walletType} size={16} />
        </Tooltip>
        <Typography className="ml-2" variant="caption">
          {chainToString(chain)}
        </Typography>
      </Box>
      <Box alignCenter>
        <Tooltip content="Copy">
          <Box onClick={handleCopyAddress}>
            <Typography
              className={baseHoverClass}
              variant="caption"
              fontWeight="semibold"
            >
              {miniAddress}
            </Typography>
          </Box>
        </Tooltip>
        <Tooltip content="Copy">
          <Icon
            className={baseHoverClass}
            name="copy"
            color="secondary"
            size={18}
            onClick={handleCopyAddress}
          />
        </Tooltip>
        <Tooltip content="QRCode">
          <Icon
            className={baseHoverClass}
            name="qrcode"
            color="secondary"
            size={18}
            onClick={handleViewQRCode}
          />
        </Tooltip>
        <Tooltip content="Go to account">
          <a href={accountUrl} target="_blank" rel="noopener noreferrer">
            <Icon
              className={baseHoverClass}
              name="external"
              color="secondary"
              size={18}
            />
          </a>
        </Tooltip>
      </Box>
      <QRCodeModal
        chain={qrData.chain}
        address={qrData.address}
        onCancel={() => setQrData(EMPTY_QR_DATA)}
      />
    </Box>
  )
}
