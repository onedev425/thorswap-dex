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
import { getTickerFromIdentifier } from 'helpers/logoURL';
import { parseToPercent } from 'helpers/parseHelpers';
import useWindowSize from 'hooks/useWindowSize';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from 'services/i18n';
import { getAddLiquidityRoute, getWithdrawRoute } from 'settings/router';
import { PoolShareType } from 'store/midgard/types';

import { LiquidityInfo } from './Info';

type LiquidityCardProps = FullMemberPool & {
  shareType: PoolShareType;
  withFooter?: boolean;
  poolUnits?: string;
  poolAssetDepth?: string;
  poolRuneDepth?: string;
  hardCapReached?: boolean;
};

const getEstimatedPoolShare = ({
  poolUnits,
  liquidityUnits,
}: {
  poolUnits: string;
  liquidityUnits: string;
}) => {
  const P = Amount.fromMidgard(poolUnits);
  const poolLiquidityUnits = Amount.fromMidgard(liquidityUnits);

  return poolLiquidityUnits.div(P).assetAmount.toNumber();
};

export const LiquidityCard = ({
  dateLastAdded,
  shareType,
  withFooter,
  pool,
  poolUnits = '0',
  sharedUnits,
  runePending,
  hardCapReached,
  assetPending,
  assetWithdrawn,
  runeWithdrawn,
  poolAssetDepth = '0',
  poolRuneDepth = '0',
}: LiquidityCardProps) => {
  const navigate = useNavigate();
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const { isMdActive } = useWindowSize();
  const poolTicker = useMemo(() => getTickerFromIdentifier(pool), [pool]);
  const poolAsset = useMemo(() => AssetEntity.fromAssetString(pool) as AssetEntity, [pool]);

  const pendingTicker = useMemo(() => {
    if (Number(runePending) > 0) return RUNEAsset.ticker;
    if (Number(assetPending) > 0) return poolTicker;
  }, [assetPending, poolTicker, runePending]);

  const lpName = useMemo(() => {
    const tickers =
      shareType === PoolShareType.SYM
        ? [RUNEAsset.ticker, poolTicker]
        : shareType === PoolShareType.ASSET_ASYM
        ? [poolTicker]
        : [RUNEAsset.ticker];

    return `${tickers.join(' + ')} LP`;
  }, [poolTicker, shareType]);

  const { runeShare, assetShare, poolShare } = useMemo(() => {
    const assetParams = { liquidityUnits: sharedUnits, poolUnits, assetDepth: poolAssetDepth };
    const runeParams = { liquidityUnits: sharedUnits, poolUnits, runeDepth: poolRuneDepth };

    const runeShare =
      shareType === PoolShareType.SYM
        ? getRuneShare(runeParams)
        : getAsymmetricRuneShare(runeParams);
    const assetShare =
      shareType === PoolShareType.SYM
        ? getAssetShare(assetParams)
        : getAsymmetricAssetShare(assetParams);
    const poolShare = getEstimatedPoolShare({ liquidityUnits: sharedUnits, poolUnits });

    return {
      runeShare: runeShare.toSignificant(6),
      assetShare: assetShare.toSignificant(6),
      poolShare: poolShare > 0.0001 ? `${parseToPercent(poolShare, 5)}` : '~0%',
    };
  }, [poolAssetDepth, poolRuneDepth, poolUnits, shareType, sharedUnits]);

  return (
    <Box col justifyCenter className="self-stretch">
      <HighlightCard className="!rounded-2xl p-2 !gap-1" type={pendingTicker ? 'warn' : 'primary'}>
        <Box alignCenter className="cursor-pointer" justify="between" onClick={toggle}>
          <Box center>
            {pendingTicker && (
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
              {lpName}
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
                {poolShare}
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
          assetPending={assetPending}
          assetShare={assetShare}
          assetWithdrawn={assetWithdrawn}
          contentRef={contentRef}
          lastAddedDate={dayjs.unix(Number(dateLastAdded)).format('YYYY-MM-DD')}
          lpName={lpName}
          maxHeightStyle={maxHeightStyle}
          pendingTicker={pendingTicker}
          poolShare={poolShare}
          runePending={runePending}
          runeShare={runeShare}
          runeWithdrawn={runeWithdrawn}
          shareType={shareType}
        />

        {withFooter && (
          <Box justifyCenter className="space-x-6 md:pr-0">
            <Box className="w-full">
              <Button
                stretch
                className="px-8 md:px-12"
                disabled={hardCapReached}
                onClick={() => navigate(getAddLiquidityRoute(poolAsset))}
                rightIcon={hardCapReached ? <Icon name="infoCircle" size={20} /> : undefined}
                tooltip={hardCapReached ? t('views.liquidity.hardCapReachedTooltip') : undefined}
                tooltipClasses="text-center mx-[-2px]"
                variant={hardCapReached ? 'fancyError' : 'primary'}
              >
                {pendingTicker
                  ? t('views.liquidity.completeButton')
                  : t('views.liquidity.addButton')}
              </Button>
            </Box>
            <Box className="w-full">
              <Button
                stretch
                className="px-8 md:px-12"
                onClick={() => navigate(getWithdrawRoute(poolAsset))}
                variant="secondary"
              >
                {t('common.withdraw')}
              </Button>
            </Box>
          </Box>
        )}
      </HighlightCard>
    </Box>
  );
};
