import type { Chain } from '@swapkit/core';
import classNames from 'classnames';
import { Box, Card } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
import { useWalletDispatch } from 'context/wallet/WalletProvider';
import { memo, useCallback } from 'react';
import { ConnectionActions } from 'views/Wallet/components/ConnectionActions';
import { CopyAddress } from 'views/Wallet/components/CopyAddress';
import { HeaderChainInfo } from 'views/Wallet/components/HeaderChainInfo';
import { WalletHeaderActions } from 'views/Wallet/components/WalletHeaderActions';

import { useAccountData, useWalletChainActions } from '../hooks';

import { ChainInfoTable } from './ChainInfoTable';

type Props = {
  chain: Chain;
  thornames: string[];
};

export const AccountRow = memo(({ thornames, chain }: Props) => {
  const walletDispatch = useWalletDispatch();
  const {
    chainWalletLoading,
    accountBalance,
    chainAddress,
    chainInfo,
    priceData,
    setIsConnectModalOpen,
    chainWallet,
  } = useAccountData(chain);

  const { handleRefreshChain } = useWalletChainActions(chain);

  const toggleConnect = useCallback(() => {
    if (chainAddress) {
      walletDispatch({ type: 'disconnectByChain', payload: chain });
    } else {
      setIsConnectModalOpen(true);
    }
  }, [chain, chainAddress, setIsConnectModalOpen, walletDispatch]);

  return (
    <Card className={classNames('overflow-hidden', borderHoverHighlightClass)}>
      <Box col className="w-full min-w-fit" flex={1}>
        <Box
          alignCenter
          row
          className="pb-2 border-0 border-b border-solid border-light-gray-light dark:border-dark-border-primary"
          justify="between"
        >
          <Box className="flex-wrap flex-1 gap-3" justify="between">
            <HeaderChainInfo balance={accountBalance} chain={chain} chainWallet={chainWallet} />
            {chainAddress && (
              <Box alignCenter className="!mr-4">
                {thornames.map((address) => (
                  <CopyAddress address={address} key={address} type="full" />
                ))}
                <WalletHeaderActions address={chainAddress} chain={chain} />
              </Box>
            )}
          </Box>

          <ConnectionActions
            handleRefreshChain={handleRefreshChain}
            isConnected={!!chainAddress}
            isLoading={chainWalletLoading}
            toggleConnect={toggleConnect}
          />
        </Box>

        <ChainInfoTable
          chain={chain}
          chainAddress={chainAddress}
          chainInfo={chainInfo}
          priceData={priceData}
        />
      </Box>
    </Card>
  );
});
