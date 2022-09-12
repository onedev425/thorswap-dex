import {
  Amount,
  Asset,
  AssetAmount,
  chainToSigAsset,
  ChainWallet,
} from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { baseBgHoverClass } from 'components/constants';
import { Scrollbar } from 'components/Scrollbar';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import { MouseEventHandler, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getSendRoute, getSwapRoute, ROUTES } from 'settings/constants';
import { useWallet } from 'store/wallet/hooks';
import { WalletHeader } from 'views/WalletBalance/WalletHeader';

import { ChainHeader } from './ChainHeader';

const sortedChains = [
  Chain.THORChain,
  Chain.Bitcoin,
  Chain.Ethereum,
  Chain.Avalanche,
  Chain.Solana,
  Chain.Doge,
  Chain.Binance,
  Chain.Litecoin,
  Chain.BitcoinCash,
  Chain.Cosmos,
];

const WalletBalance = () => {
  const navigate = useNavigate();
  const { chainWalletLoading, wallet } = useWallet();
  const { close } = useWalletDrawer();

  const handleNavigate = useCallback(
    (route: string): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        close();
        navigate(route);
      },
    [close, navigate],
  );

  const isOldRune = useCallback(
    (asset: Asset) =>
      asset.ticker === 'RUNE' && (asset.chain === Chain.Binance || asset.chain === Chain.Ethereum),
    [],
  );

  const renderBalance = useCallback(
    (chain: SupportedChain, balance: AssetAmount[]) => {
      const sigBalance = new AssetAmount(chainToSigAsset(chain), Amount.fromNormalAmount(0));

      const walletBalance = [...balance, ...(balance.length === 0 ? [sigBalance] : [])];

      return walletBalance.map((data: AssetAmount) => (
        <div key={data.asset.symbol} onClick={handleNavigate(getSwapRoute(data.asset))}>
          <Box
            alignCenter
            className={classNames(
              'p-4 cursor-pointer bg-light-bg-secondary dark:bg-dark-bg-secondary !bg-opacity-80',
              baseBgHoverClass,
            )}
            justify="between"
          >
            <Box alignCenter row className="flex-1">
              <AssetIcon asset={data.asset} size={36} />
              <Box col className="pl-2 w-[80px]">
                <Typography>{data.asset.ticker}</Typography>
                <Typography color="secondary" fontWeight="medium" variant="caption-xs">
                  {data.asset.type}
                </Typography>
              </Box>
              <Typography color="primary">{data.amount.toSignificant(6)}</Typography>
            </Box>

            <Box row className="space-x-1">
              {isOldRune(data.asset) && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={handleNavigate(ROUTES.UpgradeRune)}
                  startIcon={<Icon color="primaryBtn" name="switch" size={16} />}
                  variant="tint"
                />
              )}
              <Button
                className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                onClick={handleNavigate(getSendRoute(data.asset))}
                startIcon={<Icon color="primaryBtn" name="send" size={16} />}
                tooltip={t('common.send')}
                variant="tint"
              />
            </Box>
          </Box>
        </div>
      ));
    },
    [handleNavigate, isOldRune],
  );

  const renderChainBalance = useCallback(
    (chain: SupportedChain, chainBalance: ChainWallet) => {
      const { address, balance } = chainBalance;
      const { walletType } = chainBalance;

      return (
        <Box col className="mt-2" key={chain.toString()}>
          <ChainHeader
            address={address}
            chain={chain}
            walletLoading={chainWalletLoading?.[chain]}
            walletType={walletType}
          />
          {renderBalance(chain, balance)}
        </Box>
      );
    },
    [chainWalletLoading, renderBalance],
  );

  return (
    <Scrollbar>
      <WalletHeader />
      <Box col>
        {wallet &&
          sortedChains.map((chain) => {
            const chainBalance = wallet[chain as SupportedChain];

            if (!chainBalance) return null;

            return renderChainBalance(chain as SupportedChain, chainBalance);
          })}
      </Box>
    </Scrollbar>
  );
};

export default WalletBalance;
