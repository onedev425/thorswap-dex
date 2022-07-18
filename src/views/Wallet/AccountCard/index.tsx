import { memo, useCallback, useEffect, useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import { chainToSigAsset } from '@thorswap-lib/multichain-sdk'
import { SupportedChain, Chain } from '@thorswap-lib/types'
import classNames from 'classnames'

import { AssetChart } from 'views/Wallet/AssetChart'
import { ConnectionActions } from 'views/Wallet/components/ConnectionActions'
import { CopyAddress } from 'views/Wallet/components/CopyAddress'
import { GoToAccount } from 'views/Wallet/components/GoToAccount'
import { HeaderChainInfo } from 'views/Wallet/components/HeaderChainInfo'
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Card, Typography, useCollapse } from 'components/Atomic'
import { maxHeightTransitionClass } from 'components/Atomic/Collapse/Collapse'
import { CollapseChevron } from 'components/Atomic/Collapse/CollapseChevron'
import { borderHoverHighlightClass } from 'components/constants'
import { Scrollbar } from 'components/Scrollbar'

import { getGeckoData } from 'services/coingecko'
import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { getSendRoute, getSwapRoute } from 'settings/constants'

import { ViewMode } from 'types/app'

import { useAccountData, useWalletChainActions } from '../hooks'
import { AccountCardButton } from './AccountCardButton'
import { ChainInfo } from './ChainInfo'

type Props = {
  chain: SupportedChain
  thornames: string[]
}

export const AccountCard = memo(({ thornames, chain }: Props) => {
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse()
  const navigate = useNavigate()

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
  } = useAccountData(chain)

  const chainAssets = useMemo(
    () => chainInfo.map((elem) => elem.asset.name),
    [chainInfo],
  )

  useEffect(() => {
    getGeckoData(chainAssets)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainAssets.length])

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain)
  const sigAsset = chainToSigAsset(chain)

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
      <Box className="w-full min-w-fit" col>
        <Box
          className="pb-4 border-0 border-b-2 border-solid border-light-gray-light dark:border-dark-border-primary"
          row
          alignCenter
          justify="between"
        >
          <HeaderChainInfo
            chain={chain}
            chainWallet={chainWallet}
            balance={accountBalance}
          />

          <ConnectionActions
            isLoading={isLoading}
            isConnected={!!chainAddress}
            handleRefreshChain={handleRefreshChain}
            toggleConnect={toggleConnect}
          />
        </Box>

        <Box className="mt-3" alignCenter justify="between">
          <Box>
            <AssetIcon hasShadow asset={sigAsset} size={40} />
            <Box className="ml-2" col>
              <Typography>{sigAsset.ticker}</Typography>
              <Typography
                variant="caption-xs"
                color="secondary"
                fontWeight="medium"
              >
                {sigAsset.type}
              </Typography>
            </Box>
          </Box>

          {chainAddress && (
            <Box alignCenter>
              <Box col>
                <Box row alignCenter>
                  <CopyAddress address={chainAddress} type="short" />
                  {thornames.length > 0 && (
                    <Box onClick={toggle}>
                      <CollapseChevron isActive={isActive} />
                    </Box>
                  )}
                </Box>

                <div
                  className={maxHeightTransitionClass}
                  ref={contentRef}
                  style={maxHeightStyle}
                >
                  <Box col align="start">
                    {thornames.map((address) => (
                      <CopyAddress
                        key={address}
                        address={address}
                        type="full"
                      />
                    ))}
                  </Box>
                </div>
              </Box>

              <CopyAddress address={chainAddress} type="icon" />
              <ShowQrCode chain={chain} address={chainAddress} />
              <GoToAccount chain={chain} address={chainAddress} />
            </Box>
          )}
        </Box>

        <Box className="mt-2" col center>
          <Box alignCenter flex={1} justify="between">
            <Typography variant="h3" fontWeight="semibold">
              {formatPrice(activeAssetPrice)}
            </Typography>
          </Box>

          <Typography
            variant="caption"
            color={activeAsset24hChange >= 0 ? 'green' : 'red'}
            fontWeight="semibold"
          >
            {activeAsset24hChange.toFixed(2)}%
          </Typography>
        </Box>

        <AssetChart asset={sigAsset} mode={ViewMode.CARD} />

        <Box
          className="pb-4 border-0 border-b-2 border-solid gap-x-6 border-light-gray-light dark:border-dark-border-primary"
          center
        >
          <AccountCardButton
            icon="receive"
            label={t('common.send')}
            onClick={() => navigate(getSendRoute(sigAsset))}
            className="rotate-180"
          />

          <ShowQrCode
            address={chainAddress}
            chain={chain}
            openComponent={
              <AccountCardButton
                icon="receive"
                label={t('common.receive')}
                disabled={!chainAddress}
                tooltip={
                  chainAddress
                    ? t('views.wallet.showQRCode')
                    : t('views.walletModal.notConnected')
                }
              />
            }
          />

          <AccountCardButton
            icon="swap"
            label={t('common.swap')}
            onClick={() => navigate(getSwapRoute(sigAsset))}
            disabled={chain === Chain.Solana}
            tooltip={
              chain === Chain.Solana ? t('common.comingSoon') : undefined
            }
          />
        </Box>

        <Box className="h-24 md:h-36">
          {chainInfo.length > 0 ? (
            <Box flex={1} col className="!-mb-6">
              <Scrollbar>
                {chainInfo.map((info) => (
                  <ChainInfo
                    geckoData={geckoData}
                    key={info.asset.ticker}
                    info={info}
                  />
                ))}
              </Scrollbar>
            </Box>
          ) : (
            <Box flex={1} center>
              <Typography variant="subtitle2" color="secondary">
                {t('views.wallet.noDataToShow')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
})
