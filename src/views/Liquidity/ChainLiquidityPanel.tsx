import { Text } from '@chakra-ui/react';
import { AssetEntity } from '@thorswap-lib/swapkit-core';
import { Chain } from '@thorswap-lib/types';
import { Box, Button, Icon, Link } from 'components/Atomic';
import { InfoRow } from 'components/InfoRow';
import { LiquidityCard } from 'components/LiquidityCard';
import { ReloadButton } from 'components/ReloadButton';
import { poolByAsset } from 'helpers/assets';
import { chainName } from 'helpers/chainName';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from 'services/i18n';
import { getThorYieldLPInfoBaseRoute } from 'settings/router';
import { useMidgard } from 'store/midgard/hooks';
import { ChainMemberData, LpDetailCalculationResult, PoolShareType } from 'store/midgard/types';
import { isPendingLP } from 'store/midgard/utils';
import { ChainPoolData } from 'views/Liquidity/types';

type Props = {
  chain: Chain;
  data: ChainMemberData;
  isLoading: boolean;
  lpAddedAndWithdraw: LpDetailCalculationResult;
};

export const ChainLiquidityPanel = ({ chain, data, isLoading, lpAddedAndWithdraw }: Props) => {
  const { pools, loadMemberDetailsByChain } = useMidgard();
  const [lpLink, setLpLink] = useState('#');

  // get symm, asset asym, rune asym LPs
  const chainLiquidityPositions = useMemo(() => {
    const poolNames = Object.keys(data);

    const liquidityPositions: ChainPoolData[] = [];

    poolNames.forEach((poolAssetName: string) => {
      const poolMemberData = data[poolAssetName];
      const poolAsset = AssetEntity.fromAssetString(poolAssetName);
      if (!poolAsset) return null;

      const pool = poolByAsset(poolAsset, pools);
      if (!pool) return null;

      if (poolMemberData?.sym) {
        liquidityPositions.push({
          ...poolMemberData?.sym,
          shareType: PoolShareType.SYM,
          pool,
        });
      }

      const hasPendingLP = poolMemberData?.sym && isPendingLP(poolMemberData?.sym);

      if (!hasPendingLP && poolMemberData?.pending) {
        liquidityPositions.push({
          ...poolMemberData?.pending,
          shareType: PoolShareType.SYM,
          pool,
        });
      }

      if (poolMemberData?.assetAsym) {
        liquidityPositions.push({
          ...poolMemberData?.assetAsym,
          shareType: PoolShareType.ASSET_ASYM,
          pool,
        });
      }

      if (poolMemberData?.runeAsym) {
        liquidityPositions.push({
          ...poolMemberData?.runeAsym,
          shareType: PoolShareType.RUNE_ASYM,
          pool,
        });
      }
    });

    return liquidityPositions;
  }, [data, pools]);

  const setLiquidityLink = useCallback(async () => {
    if (!chainLiquidityPositions || chainLiquidityPositions.length === 0) return '#';
    const { getAddress } = await (await import('services/swapKit')).getSwapKitClient();
    const lpRoute = getThorYieldLPInfoBaseRoute();

    let queryParams = '';
    chainLiquidityPositions.forEach(({ shareType, pool }) => {
      if (shareType === PoolShareType.ASSET_ASYM) {
        queryParams = `${pool.asset.chain.toLowerCase()}=${getAddress(pool.asset.chain)}`;
      } else if (shareType === PoolShareType.RUNE_ASYM) {
        queryParams = `${Chain.THORChain.toLowerCase()}=${getAddress(Chain.THORChain)}`;
      } else if (shareType === PoolShareType.SYM) {
        queryParams = `${Chain.THORChain.toLowerCase()}=${getAddress(
          Chain.THORChain,
        )}&${pool.asset.chain.toLowerCase()}=${getAddress(pool.asset.chain)}`;
      }
    });

    setLpLink(`${lpRoute}?${queryParams}`);
  }, [chainLiquidityPositions]);

  useEffect(() => {
    setLiquidityLink();
  }, [setLiquidityLink]);

  return (
    <Box col className="gap-1">
      <InfoRow
        className="!mx-1.5 pl-1.5"
        label={<Text>{chainName(chain, true)}</Text>}
        size="sm"
        value={
          <Box className="gap-x-2 mb-1">
            <Link external to={lpLink}>
              <Button
                className="px-2.5"
                leftIcon={<Icon name="chart" size={16} />}
                tooltip={t('common.viewOnThoryield')}
                variant="borderlessTint"
              />
            </Link>

            <ReloadButton
              loading={isLoading}
              onLoad={() => loadMemberDetailsByChain(chain)}
              size={16}
            />
          </Box>
        }
      />

      {chainLiquidityPositions.map((liquidityPosition) => (
        <LiquidityCard
          {...liquidityPosition}
          withFooter
          key={`${liquidityPosition.pool.asset.ticker}_${liquidityPosition.shareType}`}
          lpAddedAndWithdraw={lpAddedAndWithdraw}
        />
      ))}
    </Box>
  );
};
