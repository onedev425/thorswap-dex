import { memo, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { chainToSigAsset, SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { AssetChart } from 'views/Wallet/AssetChart'
import { ConnectionActions } from 'views/Wallet/components/ConnectionActions'
import { CopyAddress } from 'views/Wallet/components/CopyAddress'
import { GoToAccount } from 'views/Wallet/components/GoToAccount'
import { HeaderChainInfo } from 'views/Wallet/components/HeaderChainInfo'
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Card, Typography } from 'components/Atomic'
import { borderHoverHighlightClass } from 'components/constants'
import { Scrollbar } from 'components/Scrollbar'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { ROUTES } from 'settings/constants'

import { ViewMode } from 'types/global'

import { useAccountData, useWalletChainActions } from '../hooks'
import { AccountCardButton } from './AccountCardButton'
import { ChainInfo } from './ChainInfo'

type Props = {
  chain: SupportedChain
}

export const AccountCard = memo(({ chain }: Props) => {
  const navigate = useNavigate()
  const {
    activeAsset24hChange,
    activeAssetPrice,
    balance,
    chainAddress,
    chainInfo,
    geckoData,
    setIsConnectModalOpen,
    chainWallet,
  } = useAccountData(chain)

  const { isLoading, handleRefreshChain } = useWalletChainActions(chain)
  const sigAsset = chainToSigAsset(chain)

  const handleConnect = useCallback(() => {
    if (!chainAddress) {
      setIsConnectModalOpen(true)
    }
  }, [chainAddress, setIsConnectModalOpen])

  const accountBalance = formatPrice(balance)

  return (
    <Card className={classNames('overflow-hidden', borderHoverHighlightClass)}>
      <Box className="w-full min-w-fit" col>
        <Box
          className="pb-4 border-0 border-b-2 border-solid border-light-border-primary dark:border-dark-border-primary"
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
            handleConnect={handleConnect}
          />
        </Box>

        <Box mt={3} alignCenter justify="between">
          <Box>
            <AssetIcon bgColor="orange" hasShadow asset={sigAsset} size={40} />
            <Box ml={2} col>
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
              <CopyAddress address={chainAddress} type="short" />
              <CopyAddress address={chainAddress} type="icon" />
              <ShowQrCode chain={chain} address={chainAddress} />
              <GoToAccount chain={chain} address={chainAddress} />
            </Box>
          )}
        </Box>

        <Box mt={2} col center>
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

        <AssetChart chain={chain} mode={ViewMode.CARD} />

        <Box
          className="gap-3 pb-4 border-0 border-b-2 border-solid border-light-border-primary dark:border-dark-border-primary"
          center
        >
          <AccountCardButton
            icon="receive"
            label={t('common.send')}
            onClick={() => navigate(ROUTES.Send)}
            className="rotate-180"
          />

          <AccountCardButton
            icon="receive"
            label={t('common.receive')}
            onClick={() => navigate(ROUTES.Send)}
          />
          <AccountCardButton
            icon="swap"
            label={t('common.swap')}
            onClick={() => navigate(`${ROUTES.Swap}?input=${sigAsset}`)}
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
