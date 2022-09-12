import { chainToSigAsset } from '@thorswap-lib/multichain-core';
import { Chain, SupportedChain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Card, Typography, useCollapse } from 'components/Atomic';
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse';
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron';
import { borderHoverHighlightClass } from 'components/constants';
import { Scrollbar } from 'components/Scrollbar';
import { formatPrice } from 'helpers/formatPrice';
import { memo, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGeckoData } from 'services/coingecko';
import { t } from 'services/i18n';
import { getSendRoute, getSwapRoute } from 'settings/constants';
import { ViewMode } from 'types/app';
import { AssetChart } from 'views/Wallet/AssetChart';
import { ConnectionActions } from 'views/Wallet/components/ConnectionActions';
import { CopyAddress } from 'views/Wallet/components/CopyAddress';
import { GoToAccount } from 'views/Wallet/components/GoToAccount';
import { HeaderChainInfo } from 'views/Wallet/components/HeaderChainInfo';
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode';

import { useAccountData, useWalletChainActions } from '../hooks';

import { AccountCardButton } from './AccountCardButton';
import { ChainInfo } from './ChainInfo';

type Props = {
  chain: SupportedChain;
  thornames: string[];
};

export const AccountCard = memo(({ thornames, chain }: Props) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const navigate = useNavigate();

  const {
    activeAsset24hChange,
    activeAssetPrice,
    balance,
    chainAddress,
    chainInfo,
    geckoData,
    setIsConnectModalOpen,
    disconnectWalletByChain,
    chainWallet,
  } = useAccountData(chain);

  const chainAssets = useMemo(() => chainInfo.map((elem) => elem.asset.name), [chainInfo]);

  useEffect(() => {
    getGeckoData(chainAssets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainAssets.length]);

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain);
  const sigAsset = chainToSigAsset(chain);

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
      <Box col className="w-full min-w-fit">
        <Box
          alignCenter
          row
          className="pb-4 border-0 border-b-2 border-solid border-light-gray-light dark:border-dark-border-primary"
          justify="between"
        >
          <HeaderChainInfo balance={accountBalance} chain={chain} chainWallet={chainWallet} />

          <ConnectionActions
            handleRefreshChain={handleRefreshChain}
            isConnected={!!chainAddress}
            isLoading={isLoading}
            toggleConnect={toggleConnect}
          />
        </Box>

        <Box alignCenter className="mt-3" justify="between">
          <Box>
            <AssetIcon hasShadow asset={sigAsset} size={40} />
            <Box col className="ml-2">
              <Typography>{sigAsset.ticker}</Typography>
              <Typography color="secondary" fontWeight="medium" variant="caption-xs">
                {sigAsset.type}
              </Typography>
            </Box>
          </Box>

          {chainAddress && (
            <Box alignCenter>
              <Box col>
                <Box alignCenter row>
                  <CopyAddress address={chainAddress} type="short" />
                  {thornames.length > 0 && (
                    <Box onClick={toggle}>
                      <CollapseChevron isActive={isActive} />
                    </Box>
                  )}
                </Box>

                <div className={maxHeightTransitionClass} ref={contentRef} style={maxHeightStyle}>
                  <Box col align="start">
                    {thornames.map((address) => (
                      <CopyAddress address={address} key={address} type="full" />
                    ))}
                  </Box>
                </div>
              </Box>

              <CopyAddress address={chainAddress} type="icon" />
              <ShowQrCode address={chainAddress} chain={chain} />
              <GoToAccount address={chainAddress} chain={chain} />
            </Box>
          )}
        </Box>

        <Box center col className="mt-2">
          <Box alignCenter flex={1} justify="between">
            <Typography fontWeight="semibold" variant="h3">
              {formatPrice(activeAssetPrice)}
            </Typography>
          </Box>

          <Typography
            color={activeAsset24hChange >= 0 ? 'green' : 'red'}
            fontWeight="semibold"
            variant="caption"
          >
            {activeAsset24hChange.toFixed(2)}%
          </Typography>
        </Box>

        <AssetChart asset={sigAsset} mode={ViewMode.CARD} />

        <Box
          center
          className="pb-4 border-0 border-b-2 border-solid gap-x-6 border-light-gray-light dark:border-dark-border-primary"
        >
          <AccountCardButton
            className="rotate-180"
            icon="receive"
            label={t('common.send')}
            onClick={() => navigate(getSendRoute(sigAsset))}
          />

          <ShowQrCode
            address={chainAddress}
            chain={chain}
            openComponent={
              <AccountCardButton
                disabled={!chainAddress}
                icon="receive"
                label={t('common.receive')}
                tooltip={
                  chainAddress ? t('views.wallet.showQRCode') : t('views.walletModal.notConnected')
                }
              />
            }
          />

          <AccountCardButton
            disabled={chain === Chain.Solana}
            icon="swap"
            label={t('common.swap')}
            onClick={() => navigate(getSwapRoute(sigAsset))}
            tooltip={chain === Chain.Solana ? t('common.comingSoon') : undefined}
          />
        </Box>

        <Box className="h-24 md:h-36">
          {chainInfo.length > 0 ? (
            <Box col className="!-mb-6" flex={1}>
              <Scrollbar>
                {chainInfo.map((info) => (
                  <ChainInfo geckoData={geckoData} info={info} key={info.asset.ticker} />
                ))}
              </Scrollbar>
            </Box>
          ) : (
            <Box center flex={1}>
              <Typography color="secondary" variant="subtitle2">
                {t('views.wallet.noDataToShow')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
});
