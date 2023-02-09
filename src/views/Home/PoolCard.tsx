import { Text } from '@chakra-ui/react';
import { Amount, Percent, Pool } from '@thorswap-lib/multichain-core';
import { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { AssetIcon } from 'components/AssetIcon';
import { Box, Button, Card } from 'components/Atomic';
import { useRuneToCurrency } from 'hooks/useRuneToCurrency';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getSwapRoute } from 'settings/router';
import { ColorType } from 'types/app';

type PoolCardProps = {
  pool: Pool;
  color: ColorType;
};

export const PoolCard = ({ pool, color }: PoolCardProps) => {
  const navigate = useNavigate();
  const runeToCurrency = useRuneToCurrency();

  const handleSwapNavigate = useCallback(() => {
    navigate(getSwapRoute(pool.asset));
  }, [navigate, pool.asset]);

  const handleAddLiquidityNavigate = useCallback(() => {
    navigate(getAddLiquidityRoute(pool.asset));
  }, [navigate, pool.asset]);

  return (
    <Card stretch className="flex-col min-w-fit max-w-[288px]">
      <Box className="px-6 pt-6" justify="between">
        <Box col>
          <Text className="mb-4" fontWeight="bold" textStyle="h2" textTransform="uppercase">
            {pool.asset.ticker}
          </Text>

          <Text className="mb-2" fontWeight="semibold" variant="secondary">
            {runeToCurrency(Amount.fromMidgard(pool.detail.runeDepth).mul(2)).toCurrencyFormat(2)}
          </Text>

          <Text fontWeight="semibold" variant="green">
            {`${t('common.APR')}: ${new Percent(pool.detail.poolAPY).toFixed(1)}`}
          </Text>
        </Box>

        <AssetIcon
          asset={pool.asset}
          hasChainIcon={[Chain.Avalanche, Chain.Ethereum].includes(pool.asset.L1Chain)}
          size={110}
        />
      </Box>

      <Box justifyCenter align="end" className="gap-x-2 mt-6">
        <Button stretch onClick={handleSwapNavigate} variant="outlineSecondary">
          {t('common.swap')}
        </Button>

        <Button stretch onClick={handleAddLiquidityNavigate} variant="outlineTertiary">
          {t('common.addLiquidity')}
        </Button>
      </Box>

      <div
        className={classNames(
          '-z-10 absolute rounded-full w-[90px] h-[90px] right-5 md:top-5 blur-xl opacity-50 dark:opacity-30',
          `bg-${color}`,
        )}
      />
    </Card>
  );
};
