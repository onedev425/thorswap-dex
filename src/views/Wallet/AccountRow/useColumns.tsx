import { useMemo } from 'react'

import {
  Asset,
  AssetAmount,
  SupportedChain,
} from '@thorswap-lib/multichain-sdk'

import { AssetChart } from 'views/Wallet/AssetChart'

import { AssetIcon } from 'components/AssetIcon'
import {
  Box,
  Button,
  Icon,
  TableColumnsConfig,
  Typography,
} from 'components/Atomic'

import { useWallet } from 'redux/wallet/hooks'

import { BreakPoint } from 'hooks/useWindowSize'

import { t } from 'services/i18n'

import { ViewMode } from 'types/global'

export const useColumns = () => {
  const { geckoData } = useWallet()

  const columns = useMemo(
    () =>
      [
        {
          id: 'asset',
          Header: 'Asset',
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
          Header: 'Amount',
          align: 'right',
          accessor: (row: AssetAmount) => row.assetAmount,
          Cell: ({ cell: { value } }: { cell: { value: AssetAmount } }) => (
            <Typography fontWeight="bold">{value.toFixed(2)}</Typography>
          ),
        },
        {
          id: 'price',
          Header: 'Price',
          align: 'right',
          accessor: (row: AssetAmount) => row.asset.ticker,
          Cell: ({ cell: { value } }: { cell: { value: string } }) => (
            <Typography fontWeight="bold">
              ${(geckoData[value]?.current_price || 0).toFixed(2)}
            </Typography>
          ),
        },
        {
          id: 'price24h',
          Header: '24h%',
          align: 'right',
          accessor: (row: AssetAmount) => row.asset.ticker,
          minScreenSize: BreakPoint.lg,
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
          Header: 'Chart (7d)',
          minScreenSize: BreakPoint.lg,
          align: 'center',
          disableSortBy: true,
          accessor: (row: AssetAmount) => row.asset.chain,
          Cell: ({ cell: { value } }: { cell: { value: SupportedChain } }) => (
            <AssetChart mode={ViewMode.LIST} chain={value} />
          ),
        },
        {
          Header: 'Actions',
          align: 'right',
          Cell: () => (
            <Box row className="gap-2" justify="end">
              <Button
                variant="tint"
                type="outline"
                startIcon={
                  <Icon
                    className="rotate-180"
                    color="secondary"
                    size={20}
                    name="receive"
                  />
                }
                onClick={() => {}}
              >
                {t('common.send')}
              </Button>
              <Button
                variant="tint"
                type="outline"
                startIcon={<Icon color="secondary" size={20} name="receive" />}
                onClick={() => {}}
              >
                {t('common.receive')}
              </Button>
              <Button
                variant="tint"
                type="outline"
                startIcon={<Icon color="secondary" size={20} name="swap" />}
                onClick={() => {}}
              >
                {t('common.swap')}
              </Button>
            </Box>
          ),
          disableSortBy: true,
          minScreenSize: BreakPoint.md,
        },
      ] as TableColumnsConfig,
    [geckoData],
  )

  return columns
}
