import { memo } from 'react'

import { chainToSigAsset, SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Icon, Typography } from 'components/Atomic'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import { useWallet } from 'store/wallet/hooks'

import { t } from 'services/i18n'

type ChainOptionProps = {
  chain: SupportedChain
  onClick?: () => void
  pendingChains: SupportedChain[]
}

export const ChainOption = memo(
  ({ pendingChains, chain, onClick }: ChainOptionProps) => {
    const { wallet } = useWallet()
    const chainWallet = wallet?.[chain]
    const isSelected = pendingChains.includes(chain)

    return (
      <Box
        className={classNames(
          'border border-solid w-full px-3 cursor-pointer h-14 rounded-xl bg-light-dark-gray dark:bg-dark-dark-gray hover:brightness-90 dark:hover:brightness-110',
          isSelected ? 'border-btn-primary' : 'border-transparent',
        )}
        onClick={onClick}
        alignCenter
        justify="between"
        row
      >
        <Box row>
          <AssetIcon asset={chainToSigAsset(chain)} />
          <Box className="pl-2" col>
            <Typography>{chain}</Typography>

            {chainWallet ? (
              <Box className="space-x-1" alignCenter row>
                <Typography
                  variant="caption-xs"
                  color="primary"
                  fontWeight="normal"
                >
                  {t('views.walletModal.connectedWith')}
                </Typography>
                <WalletIcon size={16} walletType={chainWallet.walletType} />
              </Box>
            ) : (
              <Typography variant="caption-xs" fontWeight="normal">
                {t('views.walletModal.notConnected')}
              </Typography>
            )}
          </Box>
        </Box>

        {isSelected && <Icon name="checkmark" color="primaryBtn" size={20} />}
      </Box>
    )
  },
)
