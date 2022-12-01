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
import { SORTED_CHAINS } from 'settings/chain';
import { getSendRoute, getSwapRoute, ROUTES } from 'settings/router';
import { useAppDispatch } from 'store/store';
import { useWallet } from 'store/wallet/hooks';
import { actions } from 'store/wallet/slice';

import { ChainHeader } from './ChainHeader';
import { WalletDrawer } from './WalletDrawer';
import { WalletHeader } from './WalletHeader';

const WalletBalanceList = () => {
  const navigate = useNavigate();
  const { chainWalletLoading, wallet, hiddenAssets } = useWallet();
  const { close } = useWalletDrawer();
  const appDispatch = useAppDispatch();

  const handleNavigate = useCallback(
    (route: string): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        close();
        navigate(route);
      },
    [close, navigate],
  );

  const hideAsset = useCallback(
    (asset: Asset): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        appDispatch(actions.addAssetToHidden({ chain: asset.L1Chain, address: asset.toString() }));
      },
    [appDispatch],
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

              {!data.asset.isGasAsset() && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  onClick={hideAsset(data.asset)}
                  startIcon={<Icon color="primaryBtn" name="eyeSlash" size={16} />}
                  tooltip={t('common.hide')}
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
    [handleNavigate, hideAsset, isOldRune],
  );

  const renderChainBalance = useCallback(
    (chain: SupportedChain, chainBalance: ChainWallet) => {
      const { address, balance } = chainBalance;
      const { walletType } = chainBalance;
      const filteredBalances = balance.filter(
        ({ asset }) => !hiddenAssets[chain]?.includes(asset.toString()),
      );

      return (
        <Box col className="mt-2" key={chain.toString()}>
          <ChainHeader
            address={address}
            chain={chain}
            walletLoading={!!chainWalletLoading?.[chain]}
            walletType={walletType}
          />
          {renderBalance(chain, filteredBalances)}
        </Box>
      );
    },
    [chainWalletLoading, hiddenAssets, renderBalance],
  );

  return (
    <Scrollbar>
      <WalletHeader />
      <Box col>
        {SORTED_CHAINS.map((chain) => {
          const chainBalance = wallet?.[chain as SupportedChain];
          if (!chainBalance) return null;

          return renderChainBalance(chain as SupportedChain, chainBalance);
        })}
      </Box>
    </Scrollbar>
  );
};

const WalletBalance = () => {
  const { wallet } = useWallet();

  if (!wallet) return null;

  return (
    <WalletDrawer>
      <WalletBalanceList />
    </WalletDrawer>
  );
};

export default WalletBalance;
