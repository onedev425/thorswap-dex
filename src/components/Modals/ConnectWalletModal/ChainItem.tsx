import { memo } from 'react'

import { chainToSigAsset, WalletOption } from '@thorswap-lib/multichain-sdk'
import { SupportedChain } from '@thorswap-lib/types'
import classNames from 'classnames'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Icon, Tooltip } from 'components/Atomic'
import { WalletIcon } from 'components/WalletIcon/WalletIcon'

import useWindowSize from 'hooks/useWindowSize'

import { chainName } from 'helpers/chainName'

import { WalletType } from './types'

type Props = {
  chain: SupportedChain
  walletType?: WalletOption
  selected: boolean
  isChainAvailable: boolean
  selectedWalletType?: WalletType
  onClick: (chain: SupportedChain, skipReset: boolean) => () => void
}

const ChainItem = ({
  selected,
  chain,
  selectedWalletType,
  isChainAvailable,
  onClick,
  walletType,
}: Props) => {
  const { isMdActive } = useWindowSize()

  return (
    <Box
      center
      flex={1}
      className={classNames('relative px-2 py-3 cursor-pointer', {
        'opacity-30': selectedWalletType && !isChainAvailable,
      })}
      onClick={onClick(chain, !!selectedWalletType && isChainAvailable)}
      key={chain}
    >
      <Tooltip content={chainName(chain, true)}>
        <Box
          className={classNames('rounded-full p-[2.5px] border-transparent', {
            'bg-gradient-teal': selected,
          })}
        >
          <AssetIcon
            size={isMdActive ? 40 : 32}
            asset={chainToSigAsset(chain)}
          />

          <Box
            className={classNames(
              'opacity-0 duration-200 transition-all bg-light-layout-primary dark:bg-dark-bg-secondary',
              'absolute z-20 p-0.5 rounded-xl right-3',
              'border border-solid border-cyan',
              isMdActive ? 'top-9 right-2' : 'top-8 right-1',
              { '!opacity-100': selected },
            )}
          >
            <Icon name="connect" size={14} color="cyan" />
          </Box>

          <Box
            className={classNames(
              'opacity-0 duration-200 transition-all bg-light-layout-primary dark:bg-dark-bg-secondary',
              'absolute z-20 p-0.5 rounded-xl top-0',
              isMdActive ? 'left-3' : 'left-1',
              { '!opacity-100': walletType },
            )}
          >
            <WalletIcon size={14} walletType={walletType} />
          </Box>
        </Box>
      </Tooltip>
    </Box>
  )
}

export default memo(ChainItem)
