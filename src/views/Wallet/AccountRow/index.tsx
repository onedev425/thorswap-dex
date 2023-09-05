import type { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Card } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
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
  const {
    accountBalance,
    chainAddress,
    chainInfo,
    priceData,
    setIsConnectModalOpen,
    disconnectWalletByChain,
    chainWallet,
  } = useAccountData(chain);

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain);

  const toggleConnect = useCallback(() => {
    if (chainAddress) {
      disconnectWalletByChain(chain);
    } else {
      setIsConnectModalOpen(true);
    }
  }, [chain, chainAddress, disconnectWalletByChain, setIsConnectModalOpen]);

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
            isLoading={!!isLoading}
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
