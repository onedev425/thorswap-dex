import { SupportedChain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { Box, Card } from 'components/Atomic';
import { borderHoverHighlightClass } from 'components/constants';
import { formatPrice } from 'helpers/formatPrice';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { getGeckoData } from 'services/coingecko';
import { ConnectionActions } from 'views/Wallet/components/ConnectionActions';
import { CopyAddress } from 'views/Wallet/components/CopyAddress';
import { GoToAccount } from 'views/Wallet/components/GoToAccount';
import { HeaderChainInfo } from 'views/Wallet/components/HeaderChainInfo';
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode';

import { useAccountData, useWalletChainActions } from '../hooks';

import { ChainInfoTable } from './ChainInfoTable';

type Props = {
  chain: SupportedChain;
  thornames: string[];
};

export const AccountRow = memo(({ thornames, chain }: Props) => {
  const {
    balance,
    chainAddress,
    chainInfo,
    setIsConnectModalOpen,
    disconnectWalletByChain,
    chainWallet,
  } = useAccountData(chain);

  const chainAssets = useMemo(() => {
    return chainInfo.map((elem) => elem.asset.name);
  }, [chainInfo]);

  useEffect(() => {
    getGeckoData(chainAssets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainAssets.length]);

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain);

  const toggleConnect = useCallback(() => {
    if (chainAddress) {
      disconnectWalletByChain(chain);
    } else {
      setIsConnectModalOpen(true);
    }
  }, [chain, chainAddress, disconnectWalletByChain, setIsConnectModalOpen]);

  const accountBalance = formatPrice(balance);

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
                <CopyAddress address={chainAddress} type="short" />
                <CopyAddress address={chainAddress} type="icon" />
                <ShowQrCode address={chainAddress} chain={chain} />
                <GoToAccount address={chainAddress} chain={chain} />
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

        <ChainInfoTable chain={chain} chainAddress={chainAddress} chainInfo={chainInfo} />
      </Box>
    </Card>
  );
});
