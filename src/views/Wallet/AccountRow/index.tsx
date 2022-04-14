import { memo, useCallback } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { ConnectionActions } from 'views/Wallet/components/ConnectionActions'
import { CopyAddress } from 'views/Wallet/components/CopyAddress'
import { GoToAccount } from 'views/Wallet/components/GoToAccount'
import { HeaderChainInfo } from 'views/Wallet/components/HeaderChainInfo'
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode'

import { Box, Card } from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'

import { formatPrice } from 'helpers/formatPrice'

import { useAccountData, useWalletChainActions } from '../hooks'
import { ChainInfoTable } from './ChainInfoTable'

type Props = {
  chain: SupportedChain
}

export const AccountRow = memo(({ chain }: Props) => {
  const {
    balance,
    chainAddress,
    chainInfo,
    setIsConnectModalOpen,
    disconnectWalletByChain,
    chainWallet,
  } = useAccountData(chain)

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain)

  const toggleConnect = useCallback(() => {
    if (chainAddress) {
      disconnectWalletByChain(chain)
    } else {
      setIsConnectModalOpen(true)
    }
  }, [chain, chainAddress, disconnectWalletByChain, setIsConnectModalOpen])

  const accountBalance = formatPrice(balance)

  return (
    <Card className={classNames('overflow-hidden', borderHoverHighlightClass)}>
      <Box flex={1} className="w-full min-w-fit" col>
        <Box
          className="pb-2 border-0 border-b border-solid border-light-gray-light dark:border-dark-border-primary"
          row
          alignCenter
          justify="between"
        >
          <Box className="flex-wrap flex-1 gap-3" justify="between">
            <HeaderChainInfo
              chain={chain}
              chainWallet={chainWallet}
              balance={accountBalance}
            />
            {chainAddress && (
              <Box className="!mr-4" alignCenter>
                <CopyAddress address={chainAddress} type="short" />
                <CopyAddress address={chainAddress} type="icon" />
                <ShowQrCode chain={chain} address={chainAddress} />
                <GoToAccount chain={chain} address={chainAddress} />
              </Box>
            )}
          </Box>

          <ConnectionActions
            isLoading={isLoading}
            isConnected={!!chainAddress}
            handleRefreshChain={handleRefreshChain}
            toggleConnect={toggleConnect}
          />
        </Box>

        <ChainInfoTable
          chainInfo={chainInfo}
          chain={chain}
          chainAddress={chainAddress}
        />
      </Box>
    </Card>
  )
})
