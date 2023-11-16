import { Text } from '@chakra-ui/react';
import {
  AssetValue,
  BaseDecimal,
  getAsymmetricAssetShare,
  getAsymmetricRuneShare,
  SwapKitNumber,
} from '@swapkit/core';
import type { FullMemberPool } from '@thorswap-lib/midgard-sdk';
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
  poolDetail: { asset: poolAssetString, runeDepth, assetDepth, units },
  runePending,
  shareType,
  sharedUnits,
  withFooter,
}: LiquidityCardProps) => {
  const navigate = useNavigate();
  const poolAsset = AssetValue.fromStringSync(poolAssetString) as AssetValue;
  const { isActive, contentRef, toggle, maxHeightStyle } = useCollapse();
  const { isMdActive } = useWindowSize();

  const poolShare = useMemo(
    () => parseToPercent(new SwapKitNumber(sharedUnits).div(units).getValue('string')),
    [units, sharedUnits],
  );

  //TODO no idea here
  const [runeShare, assetShare] = useMemo(() => {
    const isAsset = shareType === PoolShareType.ASSET_ASYM;
    const isRune = shareType === PoolShareType.RUNE_ASYM;
    const params = {
      liquidityUnits: sharedUnits,
      poolUnits: units,
      assetDepth,
      runeDepth,
    };

    if (!isAsset && !isRune) {
      return [
        SwapKitNumber.fromBigInt(BigInt(params.runeDepth), BaseDecimal.THOR)
          .mul(sharedUnits)
          .div(units),
        SwapKitNumber.fromBigInt(BigInt(params.assetDepth), BaseDecimal.THOR)
          .mul(sharedUnits)
          .div(units),
      ];
    }

    const assetAmount = getAsymmetricAssetShare(params).getValue('string');
    const runeAmount = getAsymmetricRuneShare(params).getValue('string');

    return isRune
      ? [new SwapKitNumber(runeAmount), new SwapKitNumber(0)]
      : [new SwapKitNumber(0), new SwapKitNumber(assetAmount)];
  }, [units, sharedUnits, runeDepth, assetDepth, shareType]);

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
          assetPending={SwapKitNumber.fromBigInt(BigInt(assetPending), 8)}
          assetShare={assetShare}
          contentRef={contentRef}
          lastAddedDate={dayjs.unix(Number(dateLastAdded)).format('YYYY-MM-DD')}
          maxHeightStyle={maxHeightStyle}
          poolShare={poolShare}
          runePending={SwapKitNumber.fromBigInt(BigInt(runePending), 8)}
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
