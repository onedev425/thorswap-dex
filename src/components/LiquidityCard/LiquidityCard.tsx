import { Amount, Asset, Liquidity } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon';
import { Box, Button, Icon, Tooltip, Typography, useCollapse } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import dayjs from 'dayjs';
import useWindowSize from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getWithdrawRoute } from 'settings/router';
import { LpDetailCalculationResult, PoolShareType } from 'store/midgard/types';
import { ChainPoolData } from 'views/Liquidity/types';

import { LiquidityInfo } from './LiquidityInfo';

type LiquidityCardProps = ChainPoolData & {
  withFooter?: boolean;
  lpAddedAndWithdraw?: LpDetailCalculationResult;
};

const RuneAsset = Asset.RUNE();

export const LiquidityCard = ({
  dateLastAdded,
  pool,
  shareType,
  withFooter,
  liquidityUnits,
  runePending,
  assetPending,
  lpAddedAndWithdraw,
}: LiquidityCardProps) => {
  const navigate = useNavigate();
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const { isMdActive } = useWindowSize();

  const liquidityObj = useMemo(
    () => new Liquidity(pool, Amount.fromMidgard(liquidityUnits)),
    [liquidityUnits, pool],
  );
  const { poolShare } = liquidityObj;
  const runeShare = useMemo(() => {
    if (shareType === PoolShareType.RUNE_ASYM) {
      return liquidityObj.getAsymRuneShare();
    }
    return liquidityObj.runeShare;
  }, [shareType, liquidityObj]);
  const assetShare = useMemo(() => {
    if (shareType === PoolShareType.ASSET_ASYM) {
      return liquidityObj.getAsymAssetShare();
    }
    return liquidityObj.assetShare;
  }, [shareType, liquidityObj]);

  const isPendingLP = useMemo(
    () => !!(Number(runePending) > 0 || Number(assetPending)),
    [runePending, assetPending],
  );

  const tickerPending =
    (isPendingLP && (Number(runePending) > 0 ? pool.asset.ticker : Asset.RUNE().ticker)) || '';

  const lpType = useMemo(() => {
    switch (shareType) {
      case PoolShareType.SYM:
        return `RUNE + ${pool.asset.ticker} LP`;
      case PoolShareType.ASSET_ASYM:
        return `${pool.asset.ticker} LP`;
      case PoolShareType.RUNE_ASYM:
        return 'RUNE LP';
    }
  }, [pool.asset.ticker, shareType]);

  const poolName = pool.detail.asset;

  const addedOrWithdrawn = lpAddedAndWithdraw ? lpAddedAndWithdraw[poolName] : null;

  return (
    <Box col justifyCenter className="self-stretch">
      <HighlightCard className="!rounded-2xl p-2 !gap-1" type={isPendingLP ? 'warn' : 'primary'}>
        <Box alignCenter className="cursor-pointer" justify="between" onClick={toggle}>
          <Box center>
            {isPendingLP && (
              <Tooltip content={t('pendingLiquidity.pendingLiquidity')}>
                <Icon className="mr-3" color="yellow" name="warn" size={24} />
              </Tooltip>
            )}

            <Box col>
              <AssetLpIcon
                inline
                asset1={pool.asset}
                asset2={RuneAsset}
                size={isActive && isMdActive ? 40 : 32}
              />
            </Box>

            <Typography
              className={classNames(
                'mx-1 md:mx-3 !transition-all',
                isActive ? 'text-body md:!text-subtitle1' : '!text-body',
              )}
              fontWeight="semibold"
            >
              {lpType}
            </Typography>
          </Box>

          <Box center className="gap-2">
            <Box col align="end">
              <Typography
                className={classNames('!transition-all', isActive ? '!text-body' : '!text-caption')}
                fontWeight="normal"
              >
                {` ${t('views.liquidity.poolShare')}`}
              </Typography>

              <Typography
                className={classNames(
                  '!transition-all',
                  isActive ? '!text-subtitle1' : '!text-body',
                )}
                fontWeight="bold"
              >
                {poolShare.toFixed(4) === '0 %' ? '~0 %' : poolShare.toFixed(4)}
              </Typography>
            </Box>

            <Icon
              className={classNames('transform duration-300 ease', {
                '-rotate-180': isActive,
              })}
              color="secondary"
              name="chevronDown"
            />
          </Box>
        </Box>

        <LiquidityInfo
          asset={pool.asset}
          assetPending={Amount.fromMidgard(assetPending)}
          assetShare={assetShare}
          assetWithdrawn={Amount.fromNormalAmount(addedOrWithdrawn?.withdrawn.asset)}
          contentRef={contentRef}
          lastAddedDate={dayjs.unix(Number(dateLastAdded)).format('YYYY-MM-DD')}
          maxHeightStyle={maxHeightStyle}
          poolShare={poolShare}
          runePending={Amount.fromMidgard(runePending)}
          runeShare={runeShare}
          runeWithdrawn={Amount.fromNormalAmount(addedOrWithdrawn?.withdrawn.rune)}
          shareType={shareType}
          tickerPending={tickerPending}
        />

        {withFooter && (
          <Box justifyCenter className="space-x-6 md:pr-0">
            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => navigate(getAddLiquidityRoute(pool.asset))}
              variant="primary"
            >
              {isPendingLP ? t('views.liquidity.completeButton') : t('views.liquidity.addButton')}
            </Button>

            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => navigate(getWithdrawRoute(pool.asset))}
              variant="secondary"
            >
              {t('common.withdraw')}
            </Button>
          </Box>
        )}
      </HighlightCard>
    </Box>
  );
};
