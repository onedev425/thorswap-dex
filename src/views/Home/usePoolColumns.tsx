import { Amount, Asset, Percent, Pool } from '@thorswap-lib/multichain-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Typography } from 'components/Atomic';
import { getAmountColumnSorter, sortPoolColumn } from 'components/Atomic/Table/utils';
import { formatPrice } from 'helpers/formatPrice';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getSwapRoute } from 'settings/constants';
import { useMidgard } from 'store/midgard/hooks';

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
            <Typography className="hidden pl-4 h4 md:block">{value.asset.ticker}</Typography>
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
        id: 'action',
        Header: () => t('common.action'),
        accessor: (row: Pool) => row.asset,
        Cell: ({ cell: { value } }: { cell: { value: Asset } }) => (
          <Box row className="gap-2" justify="end">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(getSwapRoute(value));
              }}
              type="outline"
              variant="secondary"
            >
              {t('common.swap')}
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(getAddLiquidityRoute(value));
              }}
              type="outline"
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
