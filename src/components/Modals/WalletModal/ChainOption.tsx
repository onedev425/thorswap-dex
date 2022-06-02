import { memo } from 'react'

import { chainToSigAsset, SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Typography } from 'components/Atomic'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import { useWallet } from 'store/wallet/hooks'

import useWindowSize from 'hooks/useWindowSize'

import { t } from 'services/i18n'

type ChainOptionProps = {
  chain: SupportedChain
  onClick?: () => void
  pendingChains: SupportedChain[]
}

export const ChainOption = memo(
  ({ pendingChains, chain, onClick }: ChainOptionProps) => {
    const { isMdActive } = useWindowSize()
    const { wallet } = useWallet()
    const chainWallet = wallet?.[chain]
    const isSelected = pendingChains.includes(chain)

    return (
      <Box
        className={classNames(
          'border border-solid overflow-clip cursor-pointer w-40 md:w-48 h-14 md:h-16 rounded-xl bg-light-dark-gray dark:bg-dark-dark-gray hover:brightness-90 dark:hover:brightness-110',
          isSelected
            ? 'border-btn-primary !bg-btn-primary !bg-opacity-10'
            : 'border-transparent',
        )}
        onClick={onClick}
        row
        justify="between"
      >
        <Box row alignCenter justify="between">
          <Box className="pl-2 gap-x-2" center>
            <AssetIcon
              size={isMdActive ? 36 : 26}
              hasShadow={isSelected}
              asset={chainToSigAsset(chain)}
            />

            <Box col>
              <Typography fontWeight={isSelected ? 'semibold' : 'normal'}>
                {chain}
              </Typography>

              {chainWallet ? (
                <Box className="gap-x-1.5" row justify="between">
                  <Typography variant="caption-xs">
                    {t('common.connected')}
                  </Typography>

                  <WalletIcon size={14} walletType={chainWallet.walletType} />
                </Box>
              ) : (
                <Typography variant="caption-xs" fontWeight="normal">
                  {t('views.walletModal.notConnected')}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    )
  },
)
