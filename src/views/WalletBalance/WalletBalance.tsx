import { Text } from '@chakra-ui/react';
import {
  Amount,
  AssetAmount,
  AssetEntity,
  ChainWallet,
  getSignatureAssetFor,
  isGasAsset,
} from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon } from 'components/Atomic';
import { baseBgHoverClass } from 'components/constants';
import { Scrollbar } from 'components/Scrollbar';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import { MouseEventHandler, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { SORTED_CHAINS } from 'settings/chain';
import { IS_LEDGER_LIVE } from 'settings/config';
import { getSendRoute, getSwapRoute } from 'settings/router';
import { useAppDispatch } from 'store/store';
import { useWallet } from 'store/wallet/hooks';
import { actions } from 'store/wallet/slice';

import { isLedgerLiveSupportedInputAsset } from '../../../ledgerLive/wallet/LedgerLive';

import { ChainHeader } from './ChainHeader';
import { WalletDrawer } from './WalletDrawer';
import { WalletHeader } from './WalletHeader';

const WalletBalanceList = () => {
  const navigate = useNavigate();
  const { chainWalletLoading, wallet } = useWallet();
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
    (chain: Chain, asset: AssetEntity): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        appDispatch(actions.addAssetToHidden({ chain, address: asset.toString() }));
      },
    [appDispatch],
  );

  const renderBalance = useCallback(
    (chain: Chain, balance: AssetAmount[]) => {
      const sigBalance = new AssetAmount(getSignatureAssetFor(chain), Amount.fromNormalAmount(0));
      const walletBalance = [...balance, ...(balance.length === 0 ? [sigBalance] : [])];

      return walletBalance.map((data: AssetAmount) => (
        <div
          key={data.asset.symbol}
          onClick={
            !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(data)
              ? handleNavigate(getSwapRoute(data.asset))
              : undefined
          }
        >
          <Box
            alignCenter
            className={classNames(
              'p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary !bg-opacity-80',
              `${!IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(data) ? 'cursor-pointer' : ''}`,
              !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(data) ? baseBgHoverClass : '',
            )}
            justify="between"
          >
            <Box alignCenter row className="flex-1">
              <AssetIcon asset={data.asset} size={36} />
              <Box col className="pl-2 w-[80px]">
                <Text>{data.asset.ticker}</Text>
                <Text fontWeight="medium" textStyle="caption-xs" variant="secondary">
                  {data.asset.type}
                </Text>
              </Box>
              <Text variant="primary">{data.amount.toSignificant(6)}</Text>
            </Box>

            <Box row className="space-x-1">
              {!isGasAsset(data.asset) && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  leftIcon={<Icon color="primaryBtn" name="eyeSlash" size={16} />}
                  onClick={hideAsset(chain, data.asset)}
                  tooltip={t('common.hide')}
                  variant="tint"
                />
              )}
              {!IS_LEDGER_LIVE && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  leftIcon={<Icon color="primaryBtn" name="send" size={16} />}
                  onClick={handleNavigate(getSendRoute(data.asset))}
                  tooltip={t('common.send')}
                  variant="tint"
                />
              )}
            </Box>
          </Box>
        </div>
      ));
    },
    [handleNavigate, hideAsset],
  );

  const renderChainBalance = useCallback(
    (chain: Chain, chainBalance: ChainWallet) => {
      const { address, balance } = chainBalance;
      const { walletType } = chainBalance;
      return (
        <Box col className="mt-2" key={chain.toString()}>
          <ChainHeader
            address={address}
            chain={chain}
            walletLoading={!!chainWalletLoading?.[chain]}
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
        {SORTED_CHAINS.map((chain) => {
          const chainBalance = wallet?.[chain as Chain];
          if (!chainBalance) return null;

          return renderChainBalance(chain as Chain, chainBalance);
        })}
      </Box>
    </Scrollbar>
  );
};

export const WalletBalance = () => {
  const { wallet } = useWallet();

  if (!wallet) return null;

  return (
    <WalletDrawer>
      <WalletBalanceList />
    </WalletDrawer>
  );
};
