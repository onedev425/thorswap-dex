import { useCallback } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'

import { Box, Button, Icon, Typography } from 'components/Atomic'
import { Input } from 'components/Input'
import { Scrollbar } from 'components/Scrollbar'
import { ChainOption } from 'components/WalletModal/ChainOption'
import { useHandleWalletConnect } from 'components/WalletModal/hooks'

import { t } from 'services/i18n'

import { WalletType, availableChainsByWallet, WalletStage } from './types'

type Props = {
  clearStatus: () => void
  ledgerIndex: number
  pendingChains: SupportedChain[]
  setLedgerIndex: (index: number) => void
  setPendingChains: (chains: SupportedChain[]) => void
  setWalletStage: (stage: WalletStage) => void
  walletType: WalletType
}

export const ChainSelect = ({
  clearStatus,
  ledgerIndex,
  pendingChains,
  setLedgerIndex,
  setPendingChains,
  setWalletStage,
  walletType,
}: Props) => {
  const handleConnectWallet = useHandleWalletConnect({
    ledgerIndex,
    clearStatus,
    walletType,
    pendingChains,
    setWalletStage,
  })

  const handlePendingChain = useCallback(
    (chain: SupportedChain) => {
      const newPendingChains =
        walletType === WalletType.Ledger
          ? [chain]
          : pendingChains.includes(chain)
          ? pendingChains.filter((item) => item !== chain)
          : [...pendingChains, chain]

      setPendingChains(newPendingChains)
    },
    [pendingChains, setPendingChains, walletType],
  )

  const toggleChains = useCallback(() => {
    setPendingChains(
      pendingChains.length > 0 ? [] : availableChainsByWallet[walletType],
    )
  }, [pendingChains.length, setPendingChains, walletType])

  if (
    [WalletType.CreateKeystore, WalletType.Select, WalletType.Phrase].includes(
      walletType,
    )
  ) {
    return null
  }

  const allSelected =
    pendingChains?.length === availableChainsByWallet[walletType]?.length

  return (
    <Box className="w-full space-y-2" col>
      {walletType !== WalletType.Ledger &&
        availableChainsByWallet[walletType].length > 0 && (
          <Box row justify="end">
            <Button
              type="borderless"
              variant="tint"
              endIcon={
                <Icon
                  name="selectAll"
                  color={allSelected ? 'primaryBtn' : 'primary'}
                />
              }
              onClick={toggleChains}
            >
              {t('views.walletModal.selectAll')}
            </Button>
          </Box>
        )}

      <Scrollbar maxHeight="100%" customStyle={{ marginRight: '-12px' }}>
        <Box className="flex-1 gap-2" col>
          {availableChainsByWallet[walletType].map((chain) => (
            <ChainOption
              pendingChains={pendingChains}
              key={chain}
              chain={chain}
              onClick={() => handlePendingChain(chain)}
            />
          ))}
        </Box>
      </Scrollbar>

      {walletType === WalletType.Ledger && (
        <Box alignCenter justify="between">
          <Typography>{t('views.walletModal.ledgerIndex')}:</Typography>
          <Input
            border="rounded"
            type="number"
            value={ledgerIndex}
            onChange={(e) => setLedgerIndex(parseInt(e.target.value))}
          />
        </Box>
      )}

      <Box className="w-full" alignCenter justifyCenter>
        <Button
          className="w-3/4 mt-2"
          isFancy
          size="md"
          error={pendingChains.length === 0}
          disabled={pendingChains.length === 0}
          onClick={handleConnectWallet}
        >
          {t('common.connect')}
        </Button>
      </Box>
    </Box>
  )
}
