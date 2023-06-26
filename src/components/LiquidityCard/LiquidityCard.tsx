import { Text } from '@chakra-ui/react';
import {
  Amount,
  getAssetShare,
  getAsymmetricAssetShare,
  getAsymmetricRuneShare,
  getRuneShare,
  Pool,
} from '@thorswap-lib/swapkit-core';
import classNames from 'classnames';
import { AssetLpIcon } from 'components/AssetIcon/AssetLpIcon';
import { Box, Button, Icon, Tooltip, useCollapse } from 'components/Atomic';
import { HighlightCard } from 'components/HighlightCard';
import dayjs from 'dayjs';
import { RUNEAsset } from 'helpers/assets';
import { parseToPercent } from 'helpers/parseHelpers';
import useWindowSize from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getWithdrawRoute } from 'settings/router';
import { LpDetailCalculationResult, PoolShareType } from 'store/midgard/types';

import { LiquidityInfo } from './LiquidityInfo';

type LiquidityCardProps = {
  assetPending: string;
  dateLastAdded: string;
  liquidityUnits: string;
  pool: Pool;
  runePending: string;
  shareType: PoolShareType;
  withFooter?: boolean;
  lpAddedAndWithdraw?: LpDetailCalculationResult;
};

export const LiquidityCard = ({
  dateLastAdded,
  pool: {
    asset,
    detail: { asset: poolName, units, runeDepth, assetDepth },
  },
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

  const poolShare = useMemo(
    () => parseToPercent(Amount.fromMidgard(liquidityUnits).div(units).assetAmount.toNumber()),
    [liquidityUnits, units],
  );

  const runeShare = useMemo(() => {
    const params = { liquidityUnits, poolUnits: units, runeDepth };
    return shareType === PoolShareType.RUNE_ASYM
      ? getAsymmetricRuneShare(params)
      : getRuneShare(params);
  }, [liquidityUnits, units, runeDepth, shareType]);

  const assetShare = useMemo(() => {
    const params = { liquidityUnits, poolUnits: units, assetDepth };
    return shareType === PoolShareType.ASSET_ASYM
      ? getAsymmetricAssetShare(params)
      : getAssetShare(params);
  }, [assetDepth, liquidityUnits, shareType, units]);

  const isPendingLP = useMemo(
    () => !!(Number(runePending) > 0 || Number(assetPending)),
    [runePending, assetPending],
  );

  const tickerPending =
    (isPendingLP && (Number(runePending) > 0 ? asset.ticker : RUNEAsset.ticker)) || '';

  const lpType = useMemo(() => {
    switch (shareType) {
      case PoolShareType.SYM:
        return `RUNE + ${asset.ticker} LP`;
      case PoolShareType.ASSET_ASYM:
        return `${asset.ticker} LP`;
      case PoolShareType.RUNE_ASYM:
        return 'RUNE LP';
    }
  }, [asset.ticker, shareType]);

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
                asset1={asset}
                asset2={RUNEAsset}
                size={isActive && isMdActive ? 40 : 32}
              />
            </Box>

            <Text
              className={classNames(
                'mx-1 md:mx-3 !transition-all',
                isActive ? 'text-body md:!text-subtitle1' : '!text-body',
              )}
              fontWeight="semibold"
            >
              {lpType}
            </Text>
          </Box>

          <Box center className="gap-2">
            <Box col align="end">
              <Text
                className={classNames('!transition-all', isActive ? '!text-body' : '!text-caption')}
                fontWeight="normal"
              >
                {` ${t('views.liquidity.poolShare')}`}
              </Text>

              <Text
                className={classNames(
                  '!transition-all',
                  isActive ? '!text-subtitle1' : '!text-body',
                )}
                fontWeight="bold"
              >
                {poolShare === '0 %' ? '~0 %' : poolShare}
              </Text>
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
          asset={asset}
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
              onClick={() => navigate(getAddLiquidityRoute(asset))}
              variant="primary"
            >
              {isPendingLP ? t('views.liquidity.completeButton') : t('views.liquidity.addButton')}
            </Button>

            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => navigate(getWithdrawRoute(asset))}
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
