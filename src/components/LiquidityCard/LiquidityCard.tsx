import { Text } from '@chakra-ui/react';
import type { FullMemberPool } from '@thorswap-lib/midgard-sdk';
import {
  Amount,
  AssetEntity,
  getAssetShare,
  getAsymmetricAssetShare,
  getAsymmetricRuneShare,
  getRuneShare,
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
import type { PoolDetail } from 'store/midgard/types';
import { PoolShareType } from 'store/midgard/types';

import { LiquidityInfo } from './LiquidityInfo';

type LiquidityCardProps = FullMemberPool & {
  shareType: PoolShareType;
  withFooter?: boolean;
  poolDetail: PoolDetail;
};

export const LiquidityCard = ({
  assetPending,
  dateLastAdded,
  poolDetail: { asset: poolAssetString, liquidityUnits, runeDepth, assetDepth },
  runePending,
  shareType,
  sharedUnits,
  withFooter,
}: LiquidityCardProps) => {
  const navigate = useNavigate();
  const poolAsset = AssetEntity.fromAssetString(poolAssetString) as AssetEntity;
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const { isMdActive } = useWindowSize();

  const poolShare = useMemo(
    () =>
      parseToPercent(Amount.fromMidgard(liquidityUnits).div(sharedUnits).assetAmount.toNumber()),
    [liquidityUnits, sharedUnits],
  );

  const runeShare = useMemo(() => {
    const params = { liquidityUnits, poolUnits: sharedUnits, runeDepth };
    return shareType === PoolShareType.RUNE_ASYM
      ? getAsymmetricRuneShare(params)
      : getRuneShare(params);
  }, [liquidityUnits, sharedUnits, runeDepth, shareType]);

  const assetShare = useMemo(() => {
    const params = { liquidityUnits, poolUnits: sharedUnits, assetDepth };
    return shareType === PoolShareType.ASSET_ASYM
      ? getAsymmetricAssetShare(params)
      : getAssetShare(params);
  }, [assetDepth, liquidityUnits, shareType, sharedUnits]);

  const isPendingLP = useMemo(
    () => !!(Number(runePending) || Number(assetPending)),
    [runePending, assetPending],
  );

  const tickerPending =
    (isPendingLP && (Number(runePending) > 0 ? poolAsset.ticker : RUNEAsset.ticker)) || '';

  const lpType = useMemo(() => {
    switch (shareType) {
      case PoolShareType.SYM:
        return `RUNE + ${poolAsset.ticker} LP`;
      case PoolShareType.ASSET_ASYM:
        return `${poolAsset.ticker} LP`;
      case PoolShareType.RUNE_ASYM:
        return 'RUNE LP';
    }
  }, [poolAsset.ticker, shareType]);

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
                asset1={poolAsset}
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
          asset={poolAsset}
          assetPending={Amount.fromMidgard(assetPending)}
          assetShare={assetShare}
          contentRef={contentRef}
          lastAddedDate={dayjs.unix(Number(dateLastAdded)).format('YYYY-MM-DD')}
          maxHeightStyle={maxHeightStyle}
          poolShare={poolShare}
          runePending={Amount.fromMidgard(runePending)}
          runeShare={runeShare}
          shareType={shareType}
          tickerPending={tickerPending}
        />

        {withFooter && (
          <Box justifyCenter className="space-x-6 md:pr-0">
            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => navigate(getAddLiquidityRoute(poolAsset))}
              variant="primary"
            >
              {isPendingLP ? t('views.liquidity.completeButton') : t('views.liquidity.addButton')}
            </Button>

            <Button
              stretch
              className="px-8 md:px-12"
              onClick={() => navigate(getWithdrawRoute(poolAsset))}
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
