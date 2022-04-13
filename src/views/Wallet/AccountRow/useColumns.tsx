import { useMemo } from 'react'

import { useNavigate } from 'react-router-dom'

import {
  Amount,
  Asset,
  AssetAmount,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'

import { AssetChart } from 'views/Wallet/AssetChart'
import { ShowQrCode } from 'views/Wallet/components/ShowQrCode'

import { AssetIcon } from 'components/AssetIcon'
import {
  Box,
  Button,
  Icon,
  TableColumnsConfig,
  Typography,
} from 'components/Atomic'

import { useMidgard } from 'store/midgard/hooks'
import { useWallet } from 'store/wallet/hooks'

import useWindowSize, { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { formatPrice } from 'helpers/formatPrice'

import { getSwapRoute } from 'settings/constants'

import { ViewMode } from 'types/app'

export const useColumns = (chainAddress: string, chain: SupportedChain) => {
  const navigate = useNavigate()
  const { stats } = useMidgard()
  const { geckoData } = useWallet()
  const { isLgActive } = useWindowSize()

  const runePrice = stats?.runePriceUSD

  const columns = useMemo(
    () =>
      [
        {
          id: 'asset',
          Header: () => t('common.asset'),
          disableSortBy: true,
          accessor: (row: AssetAmount) => row.asset,
          Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
            <Box flex={1} alignCenter>
              <AssetIcon asset={value} hasChainIcon size={40} />
              <Box col justify="between" className="pl-4">
                <Typography>{value.name}</Typography>
                <Typography color="secondary">{value.type}</Typography>
              </Box>
            </Box>
          ),
        },
        {
          id: 'amount',
          Header: () => t('common.amount'),
          align: 'right',
          minScreenSize: BreakPoint.md,
          accessor: (row: Amount) => row.assetAmount,
          Cell: ({ cell: { value } }: { cell: { value: AssetAmount } }) => (
            <Typography fontWeight="bold">
              {chainAddress ? value.toFixed(2) : '-'}
            </Typography>
          ),
        },
        {
          id: 'price',
          Header: () => t('common.usdPrice'),
          align: 'right',
          minScreenSize: BreakPoint.md,
          accessor: (row: AssetAmount) => row.asset.ticker,
          Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <Typography fontWeight="bold">
              {formatPrice(
                value === 'RUNE' && runePrice
                  ? parseFloat(runePrice)
                  : geckoData[value]?.current_price || 0,
              )}
            </Typography>
          ),
        },
        {
          id: 'price24h',
          Header: () => '24h%',
          align: 'right',
          accessor: (row: AssetAmount) => row.asset.ticker,
          minScreenSize: BreakPoint.md,
          Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <Typography
              color={
                (geckoData[value]?.price_change_percentage_24h || 0) >= 0
                  ? 'green'
                  : 'red'
              }
              fontWeight="bold"
            >
              {(geckoData[value]?.price_change_percentage_24h || 0).toFixed(2)}%
            </Typography>
          ),
        },
        {
          id: 'chart',
          Header: () => t('views.wallet.chart7d'),
          minScreenSize: BreakPoint.lg,
          align: 'center',
          disableSortBy: true,
          accessor: (row: AssetAmount) => row.asset,
          Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
            <AssetChart mode={ViewMode.LIST} asset={value} />
          ),
        },
        {
          accessor: (row) => row.asset,
          id: 'actions',
          Header: () => '',
          align: 'right',
          disableSortBy: true,
          Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
            <Box row className="gap-2" justify="end">
              <Button
                variant="tint"
                startIcon={
                  <Icon
                    className="rotate-180 group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                    color="secondary"
                    size={20}
                    name="receive"
                  />
                }
                onClick={() => {}}
              >
                {isLgActive ? t('common.send') : null}
              </Button>

              <ShowQrCode
                address={chainAddress}
                chain={chain}
                openComponent={
                  <Button
                    variant="tint"
                    startIcon={
                      <Icon
                        className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                        color="secondary"
                        size={20}
                        name="receive"
                      />
                    }
                  >
                    {isLgActive ? t('common.receive') : null}
                  </Button>
                }
              />

              <Button
                variant="tint"
                startIcon={
                  <Icon
                    className="group-hover:!text-light-typo-primary dark:group-hover:!text-dark-typo-primary"
                    color="secondary"
                    size={20}
                    name="swap"
                  />
                }
                onClick={() => navigate(getSwapRoute(value))}
              >
                {isLgActive ? t('common.swap') : null}
              </Button>
            </Box>
          ),
        },
      ] as TableColumnsConfig,
    [geckoData, chainAddress, isLgActive, runePrice, navigate, chain],
  )

  return columns
}
