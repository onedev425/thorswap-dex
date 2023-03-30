import { Text } from '@chakra-ui/react';
import { Amount, AssetEntity, Percent, Pool } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon } from 'components/Atomic';
import { getAmountColumnSorter, sortPoolColumn } from 'components/Atomic/Table/utils';
import { formatPrice } from 'helpers/formatPrice';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getSwapRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';

type TimePeriods = {
  '180d': string;
  '100d': string;
  '90d': string;
  '30d': string;
  '7d': string;
  '24h': string;
  '1h': string;
};

const timePeriods: TimePeriods = {
  '180d': '180 days',
  '100d': '100 days',
  '90d': '90 days',
  '30d': '30 days',
  '7d': '7 days',
  '24h': '24 hours',
  '1h': '1 hour',
};

export const usePoolColumns = () => {
  const navigate = useNavigate();
  const { poolLoading } = useMidgard();
  const runeToCurrency = useRuneToCurrency();

  const columns = useMemo(
    () => [
      {
        id: 'pool',
        Header: () => t('common.pool'),
        accessor: (row: Pool) => row,
        sortType: sortPoolColumn,
        Cell: ({ cell: { value } }: { cell: { value: Pool } }) => (
          <div className="flex flex-row items-center">
            <AssetIcon asset={value.asset} size={40} />
            <Text className="hidden pl-4 h4 md:block">{value.asset.ticker}</Text>
          </div>
        ),
      },
      {
        id: 'price',
        Header: () => t('common.usdPrice'),
        accessor: (row: Pool) =>
          Amount.fromAssetAmount(row.detail.assetPriceUSD, row.asset.decimal),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => formatPrice(value),
        sortType: getAmountColumnSorter('price'),
      },
      {
        id: 'liquidity',
        Header: () => t('common.liquidity'),
        accessor: (row: Pool) => Amount.fromMidgard(row.detail.runeDepth).mul(2),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
          runeToCurrency(value).toCurrencyFormat(2),
        sortType: getAmountColumnSorter('liquidity'),
      },
      {
        id: 'volume24h',
        Header: () => t('common.24Volume'),
        accessor: (row: Pool) => Amount.fromMidgard(row.detail.volume24h),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) =>
          runeToCurrency(value).toCurrencyFormat(2),
        minScreenSize: BreakPoint.lg,
        sortType: getAmountColumnSorter('volume24h'),
      },
      {
        id: 'apr',
        Header: () => t('common.APR'),
        accessor: (row: Pool) => new Percent(row.detail.poolAPY),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Percent } }) =>
          value.lte(0) && poolLoading ? <Icon spin name="loader" size={16} /> : value.toFixed(2),
        sortType: getAmountColumnSorter('apr'),
      },
      {
        id: 'aprPeriod',
        Header: () => t('common.APRPeriod'),
        accessor: (row: Pool) => row.detail.apyPeriod,
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: string } }) => (
          <div className="flex flex-row items-center justify-center">
            <Text className="pl-4 h4 md:block">{timePeriods[value as keyof TimePeriods]}</Text>
          </div>
        ),
      },
      {
        id: 'action',
        Header: () => t('common.action'),
        accessor: (row: Pool) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: AssetEntity } }) => (
          <Box row className="gap-2" justify="end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(getSwapRoute(value));
              }}
              variant="outlineSecondary"
            >
              {t('common.swap')}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(getAddLiquidityRoute(value));
              }}
              variant="outlinePrimary"
            >
              {t('common.addLiquidity')}
            </Button>
          </Box>
        ),
        disableSortBy: true,
        minScreenSize: BreakPoint.md,
      },
    ],
    [navigate, poolLoading, runeToCurrency],
  );

  return columns;
};
