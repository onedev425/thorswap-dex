import { Text } from '@chakra-ui/react';
import type { Chain } from '@swapkit/core';
import { AssetValue, isGasAsset, WalletOption } from '@swapkit/core';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon } from 'components/Atomic';
import { baseBgHoverClass } from 'components/constants';
import { Scrollbar } from 'components/Scrollbar';
import { useWalletDrawer } from 'hooks/useWalletDrawer';
import type { MouseEventHandler } from 'react';
import { memo, useCallback, useMemo } from 'react';
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

type ChainBalanceProps = {
  chain: Chain;
  address: string;
  loading: boolean;
  walletType: WalletOption;
  balance: AssetValue[];
};

const ChainBalance = memo(({ chain, address, loading, walletType, balance }: ChainBalanceProps) => {
  const navigate = useNavigate();
  const { close } = useWalletDrawer();
  const appDispatch = useAppDispatch();

  const walletBalance = useMemo(
    () => [...balance, ...(balance.length === 0 ? [AssetValue.fromChainOrSignature(chain)] : [])],
    [balance, chain],
  );

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
    (chain: Chain, assetValue: AssetValue): MouseEventHandler<HTMLDivElement | HTMLButtonElement> =>
      (event) => {
        event.stopPropagation();
        appDispatch(actions.addAssetToHidden({ chain, address: assetValue.toString() }));
      },
    [appDispatch],
  );

  return (
    <Box col className="mt-2" key={chain.toString()}>
      <ChainHeader
        address={address}
        chain={chain}
        walletLoading={loading}
        walletType={walletType}
      />

      {walletBalance.map((assetValue) => (
        <div
          key={assetValue.symbol}
          onClick={
            !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(assetValue)
              ? handleNavigate(getSwapRoute(assetValue))
              : undefined
          }
        >
          <Box
            alignCenter
            className={classNames(
              'p-4 bg-light-bg-secondary dark:bg-dark-bg-secondary !bg-opacity-80',
              `${
                !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(assetValue)
                  ? 'cursor-pointer'
                  : ''
              }`,
              !IS_LEDGER_LIVE || isLedgerLiveSupportedInputAsset(assetValue)
                ? baseBgHoverClass
                : '',
            )}
            justify="between"
          >
            <Box alignCenter row className="flex-1">
              <AssetIcon asset={assetValue} size={36} />
              <Box col className="pl-2 w-[80px]">
                <Text>{assetValue.ticker}</Text>
                <Text fontWeight="medium" textStyle="caption-xs" variant="secondary">
                  {assetValue.type}
                </Text>
              </Box>
              <Text variant="primary">{assetValue.toSignificant(6)}</Text>
            </Box>

            <Box row className="space-x-1">
              {!isGasAsset(assetValue) && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  leftIcon={<Icon color="primaryBtn" name="eyeSlash" size={16} />}
                  onClick={hideAsset(chain, assetValue)}
                  tooltip={t('common.hide')}
                  variant="tint"
                />
              )}
              {!IS_LEDGER_LIVE && (
                <Button
                  className="px-3 hover:bg-transparent dark:hover:bg-transparent"
                  leftIcon={<Icon color="primaryBtn" name="send" size={16} />}
                  onClick={handleNavigate(getSendRoute(assetValue))}
                  tooltip={t('common.send')}
                  variant="tint"
                />
              )}
            </Box>
          </Box>
        </div>
      ))}
    </Box>
  );
});

export const WalletBalance = () => {
  const { chainWalletLoading, wallet } = useWallet();

  const isWalletConnected = useMemo(
    () => SORTED_CHAINS.some((chain) => wallet?.[chain as Chain]),
    [wallet],
  );

  if (!isWalletConnected) return null;

  return (
    <WalletDrawer>
      <Scrollbar>
        <WalletHeader />
        <Box col>
          {SORTED_CHAINS.map((chain) =>
            wallet?.[chain]?.address ? (
              <ChainBalance
                address={wallet?.[chain]?.address ?? ''}
                balance={wallet?.[chain]?.balance ?? []}
                chain={chain}
                key={chain}
                loading={!!chainWalletLoading[chain]}
                walletType={wallet?.[chain]?.walletType ?? WalletOption.KEYSTORE}
              />
            ) : null,
          )}
        </Box>
      </Scrollbar>
    </WalletDrawer>
  );
};
