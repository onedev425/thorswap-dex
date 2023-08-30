import { Link, Text } from '@chakra-ui/react';
import { Amount, AssetEntity, Pool } from '@thorswap-lib/swapkit-core';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Icon, Tooltip } from 'components/Atomic';
import { getAmountColumnSorter, sortPoolColumn } from 'components/Atomic/Table/utils';
import { INTRODUCTION_TO_LUVI_URL } from 'config/constants';
import { formatPrice } from 'helpers/formatPrice';
import { parseToPercent } from 'helpers/parseHelpers';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { BreakPoint } from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getSwapRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { PoolCategoryOption } from 'views/Home/types';

export type TimePeriods = {
  '30d': string;
  '7d': string;
};

const timePeriods: TimePeriods = {
  '30d': '30 days',
  '7d': '7 days',
};

export const usePoolColumns = (poolCategory: PoolCategoryOption) => {
  const navigate = useNavigate();
  const { poolLoading } = useMidgard();
  const runeToCurrency = useRuneToCurrency();

  const columns = useMemo(() => {
    const apr =
      poolCategory === PoolCategoryOption.Savers
        ? {
            id: 'saversApr',
            Header: (): string => t('common.saversApr'),
            accessor: (row: Pool) => parseToPercent(row.detail.saversAPR),
            align: 'right',
            Cell: ({ cell: { value } }: { cell: { value: string } }) =>
              poolLoading ? (
                <Box justify="end">
                  <Icon spin name="loader" size={16} />
                </Box>
              ) : (
                value
              ),
            sortType: getAmountColumnSorter('saversApr'),
            toolTip: (
              <Tooltip content={t('views.home.aprExplanation')} place="bottom">
                <Link
                  href={INTRODUCTION_TO_LUVI_URL}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  zIndex={1}
                >
                  <Icon
                    className="p-1 absolute top-1.5 text-xs rounded-lg transform mx-1 hover:bg-btn-primary fill-btn-primary hover:fill-white"
                    name="question"
                    size={16}
                  />
                </Link>
              </Tooltip>
            ),
          }
        : {
            id: 'apr',
            Header: (): string => t('common.APR'),
            accessor: (row: Pool) => parseToPercent(row.detail.annualPercentageRate),
            align: 'right',
            Cell: ({ cell: { value } }: { cell: { value: string } }) =>
              poolLoading ? (
                <Box justify="end">
                  <Icon spin name="loader" size={16} />
                </Box>
              ) : (
                value
              ),
            sortType: getAmountColumnSorter('apr'),
            toolTip: (
              <Tooltip content={t('views.home.aprExplanation')} place="bottom">
                <Link
                  href={INTRODUCTION_TO_LUVI_URL}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  zIndex={1}
                >
                  <Icon
                    className="p-1 absolute top-1.5 text-xs rounded-lg transform mx-1 hover:bg-btn-primary fill-btn-primary hover:fill-white"
                    name="question"
                    size={16}
                  />
                </Link>
              </Tooltip>
            ),
          };
    const columns = [
      {
        id: 'pool',
        Header: (): string => t('common.pool'),
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
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => runeToCurrency(value),
        sortType: getAmountColumnSorter('liquidity'),
      },
      {
        id: 'volume24h',
        Header: () => t('common.24Volume'),
        accessor: (row: Pool) => Amount.fromMidgard(row.detail.volume24h),
        align: 'right',
        Cell: ({ cell: { value } }: { cell: { value: Amount } }) => runeToCurrency(value),
        minScreenSize: BreakPoint.lg,
        sortType: getAmountColumnSorter('volume24h'),
      },
      apr,
      {
        id: 'aprPeriod',
        Header: () => t('common.APRPeriod'),
        disableSortBy: true,
        // @ts-expect-error
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
    ];

    return columns;
  }, [navigate, poolCategory, poolLoading, runeToCurrency]);

  return columns;
};
