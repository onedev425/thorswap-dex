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
    chainWallet,
  } = useAccountData(chain)

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain)

  const handleConnect = useCallback(() => {
    if (!chainAddress) {
      setIsConnectModalOpen(true)
    }
  }, [chainAddress, setIsConnectModalOpen])

  const accountBalance = formatPrice(balance)

  return (
    <Card className={classNames('overflow-hidden', borderHoverHighlightClass)}>
      <Box flex={1} className="w-full min-w-fit" col>
        <Box
          className={classNames({
            'pb-4 border-0 border-b-2 border-solid border-light-border-primary dark:border-dark-border-primary':
              chainAddress,
          })}
          row
          alignCenter
          justify="between"
        >
          <Box className="gap-3 flex-1 flex-wrap" justify="between">
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
            handleConnect={handleConnect}
          />
        </Box>

        {chainInfo.length > 0 && (
          <ChainInfoTable chainInfo={chainInfo} chain={chain} />
        )}
      </Box>
    </Card>
  )
})
