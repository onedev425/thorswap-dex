import { memo, useMemo } from 'react'

import { Asset, chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { Chain, SupportedChain } from '@thorswap-lib/types'
import { TERRAChain } from '@thorswap-lib/xchain-util'
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
  isSelected: boolean
}

export const ChainOption = memo(
  ({ isSelected, chain, onClick }: ChainOptionProps) => {
    const { isMdActive } = useWindowSize()
    const { wallet } = useWallet()
    const chainWallet = wallet?.[chain]
    const chainName = useMemo(() => {
      switch (chain) {
        case Chain.THORChain:
          return 'RUNE'
        case Chain.Cosmos:
          return 'COSMOS'
        default:
          return chain
      }
    }, [chain])

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
              asset={
                // @ts-expect-error remove after TERRA
                chain === TERRAChain ? Asset.LUNA() : chainToSigAsset(chain)
              }
            />

            <Box col>
              <Typography fontWeight={isSelected ? 'semibold' : 'normal'}>
                {chainName}
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
