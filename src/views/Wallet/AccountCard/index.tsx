import { memo, useCallback } from 'react'

import { chainToSigAsset, SupportedChain } from '@thorswap-lib/multichain-sdk'
import { chainToString } from '@thorswap-lib/xchain-util'
import { shortenAddress } from 'utils/shortenAddress'

import { AssetChart } from 'views/Wallet/AssetChart'

import { AssetIcon } from 'components/AssetIcon'
import { Box, Button, Card, Icon, Typography } from 'components/Atomic'
import { Scrollbar } from 'components/Scrollbar'

import { t } from 'services/i18n'

import { ViewMode } from 'types/global'

import { useAccountData } from '../hooks'
import { AccountCardButton } from './AccountCardButton'
import { ChainInfo } from './ChainInfo'

type Props = {
  chain: SupportedChain
}

export const AccountCard = memo(({ chain }: Props) => {
  const {
    activeAsset24hChange,
    activeAssetPrice,
    balance,
    chainAddress,
    chainInfo,
    chainWalletLoading,
    geckoData,
    setIsConnectModalOpen,
  } = useAccountData(chain)

  const isChainLoading = chainWalletLoading[chain]
  const sigAsset = chainToSigAsset(chain)

  const handleConnect = useCallback(() => {
    if (!chainAddress) {
      setIsConnectModalOpen(true)
    }
  }, [chainAddress, setIsConnectModalOpen])

  return (
    <Card className="!p-6 overflow-hidden">
      <Box className="w-full min-w-fit" col>
        <Box
          className="pb-4 border-0 border-b-2 border-solid border-light-border-primary dark:border-dark-border-primary"
          row
          alignCenter
          justify="between"
        >
          <Box center className="space-x-1">
            <Typography variant="subtitle2">{chainToString(chain)}</Typography>
            <Typography color="secondary">
              {chainAddress && ` ($${balance.toFixed(2)})`}
            </Typography>
          </Box>

          <Button
            disabled={isChainLoading}
            type={chainAddress ? 'outline' : 'default'}
            onClick={handleConnect}
          >
            <Box center className="gap-x-2">
              {isChainLoading && (
                <Icon name="refresh" color="primary" size={16} spin />
              )}
              {chainAddress ? t('common.disconnect') : t('common.connect')}
            </Box>
          </Button>
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
            <Box center row className="gap-x-3">
              <Icon
                onClick={() => {}}
                color="secondary"
                name="refresh"
                size={18}
              />
              <Icon
                onClick={() => {}}
                color="secondary"
                name="qrcode"
                size={18}
              />
              <Icon
                onClick={() => {}}
                color="secondary"
                name="import"
                size={18}
              />
            </Box>
          )}
        </Box>

        <Box mt={3} col>
          <Box alignCenter flex={1} justify="between">
            <Typography variant="h3">${activeAssetPrice}</Typography>

            {chainAddress && (
              <Box center className="gap-x-2">
                <Icon name="eye" color="secondary" />
                <Typography variant="caption">
                  {shortenAddress(chainAddress, 8, 5)}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography variant="caption" color="red" fontWeight="semibold">
            {activeAsset24hChange.toFixed(2)}%
          </Typography>
        </Box>

        <AssetChart chain={chain} mode={ViewMode.CARD} />

        <Box
          className="pb-4 gap-8 border-0 border-b-2 border-solid border-light-border-primary dark:border-dark-border-primary"
          center
        >
          <AccountCardButton
            icon="receive"
            label={t('common.send')}
            onClick={() => {}}
            className="rotate-180"
          />

          <AccountCardButton
            icon="receive"
            label={t('common.receive')}
            onClick={() => {}}
          />
          <AccountCardButton
            icon="swap"
            label={t('common.swap')}
            onClick={() => {}}
          />
        </Box>

        <Box className="h-24 md:h-36">
          {chainInfo.length > 0 ? (
            <Box col flex={1}>
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
              <Typography variant="subtitle1">
                {t('views.wallet.noDataToShow')}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
})
