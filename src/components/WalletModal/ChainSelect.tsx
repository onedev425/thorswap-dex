import { useCallback, useMemo } from 'react'

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

  const walletChains = useMemo(
    () => availableChainsByWallet[walletType] || [],
    [walletType],
  )

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
    setPendingChains(pendingChains.length > 0 ? [] : walletChains)
  }, [pendingChains.length, setPendingChains, walletChains])

  const allSelected = pendingChains?.length === walletChains.length

  const disabledButton = pendingChains.length === 0

  return (
    <Box className="w-full space-y-2" col>
      {walletType !== WalletType.Ledger && walletChains.length > 0 && (
        <Box row className="p-2" justify="end">
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
        <Box flex={1} center className="px-6 gap-2 flex-wrap" row>
          {walletChains.map((chain) => (
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
        <Box center className="gap-x-4">
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
          error={disabledButton}
          disabled={disabledButton}
          onClick={handleConnectWallet}
        >
          {t('common.connect')}
        </Button>
      </Box>
    </Box>
  )
}
