import { useCallback, useMemo, useState } from 'react'

import { SupportedChain, WalletOption } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'

import { CopyAddress } from 'views/Wallet/components/CopyAddress'
import { GoToAccount } from 'views/Wallet/components/GoToAccount'
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode'
import { useWalletChainActions } from 'views/Wallet/hooks'

import { Box, Tooltip, Typography } from 'components/Atomic'
import { HoverIcon } from 'components/HoverIcon'
import { PhraseModal } from 'components/Modals/PhraseModal'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import { t } from 'services/i18n'

export type ChainHeaderProps = {
  chain: SupportedChain
  address: string
  totalPrice?: string
  onReload?: () => void
  viewPhrase?: () => void
  walletLoading?: boolean
  walletType: WalletOption
}

export const ChainHeader = ({
  chain,
  address,
  walletType,
  walletLoading = false,
}: ChainHeaderProps) => {
  const { handleRefreshChain } = useWalletChainActions(chain)

  const [isPhraseModalVisible, setIsPhraseModalVisible] = useState(false)

  const handleClosePhraseModal = () => {
    setIsPhraseModalVisible(false)
  }

  const handleClickWalletIcon = useCallback(async () => {
    if (walletType === WalletOption.KEYSTORE) {
      setIsPhraseModalVisible(true)
    }

    if (walletType === WalletOption.LEDGER && chain === 'THOR') {
      // const addr = await multichain.thor.verifyLedgerAddress()
      // TODO: show notification to verify ledger address
    }
  }, [walletType, chain])

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
      className="px-2 py-1 bg-btn-light-tint dark:bg-btn-dark-tint"
      justify="between"
    >
      <Box alignCenter>
        <HoverIcon
          iconName="refresh"
          tooltip={t('common.refresh')}
          size={16}
          spin={walletLoading}
          onClick={handleRefreshChain}
        />
        <Tooltip content={walletTooltip}>
          <WalletIcon
            onClick={handleClickWalletIcon}
            walletType={walletType}
            size={16}
          />
        </Tooltip>
        <Typography className="ml-1" variant="caption">
          {chainToString(chain)}
        </Typography>
      </Box>
      <Box alignCenter>
        <CopyAddress address={address} type="mini" />
        <CopyAddress address={address} type="icon" />
        <ShowQrCode address={address} chain={chain} />
        <GoToAccount chain={chain} address={address} />
      </Box>

      <PhraseModal
        isOpen={isPhraseModalVisible}
        onCancel={handleClosePhraseModal}
      />
    </Box>
  )
}
