import { Text } from '@chakra-ui/react';
import type { Chain } from '@thorswap-lib/types';
import classNames from 'classnames';
import { FallbackIcon } from 'components/AssetIcon/FallbackIcon';
import { Box } from 'components/Atomic';
import { RUNEAsset } from 'helpers/assets';
import { tokenLogoURL } from 'helpers/logoURL';
import { memo, useMemo } from 'react';

import { genericBgClasses } from '../constants';

import { ChainIcon, FORCE_ICON_CHAINS } from './ChainIcon';
import type { AssetIconProps } from './types';
import { iconSizes } from './types';
import { getSecondaryIconPlacementStyle } from './utils';

const AssetIconComponent = ({
  shadowPosition = 'corner',
  iconUrl,
  showChainIcon,
  className,
  isSynth,
  hasShadow,
  symbol,
  chain,
  bgColor,
  badge,
  ticker,
  secondaryIconPlacement = 'br',
  size = 40,
}: Pick<
  AssetIconProps,
  | 'badge'
  | 'secondaryIconPlacement'
  | 'bgColor'
  | 'size'
  | 'hasShadow'
  | 'shadowPosition'
  | 'className'
> & {
  chain: Chain;
  iconUrl: string;
  symbol: string;
  ticker: string;
  isSynth: boolean;
  showChainIcon: boolean;
}) => {
  const { iconSize, secondaryIconSize } = useMemo(() => {
    const iconSize = typeof size === 'number' ? size : iconSizes[size];
    return { iconSize, secondaryIconSize: iconSize * 0.52 };
  }, [size]);

  const style = useMemo(() => ({ width: iconSize, height: iconSize }), [iconSize]);
  const badgeStyle = useMemo(
    () => ({
      fontSize: secondaryIconSize * 0.9,
      padding: 3,
    }),
    [secondaryIconSize],
  );

  const secondaryIconPlacementStyle = useMemo(
    () => getSecondaryIconPlacementStyle(secondaryIconPlacement, secondaryIconSize),
    [secondaryIconPlacement, secondaryIconSize],
  );

  const badgeContanerStyle = useMemo(
    () => ({
      ...getSecondaryIconPlacementStyle(secondaryIconPlacement, secondaryIconSize * 1.8),
      width: secondaryIconSize * 1.8,
      height: secondaryIconSize * 1.8,
    }),
    [secondaryIconPlacement, secondaryIconSize],
  );

  return (
    <div
      className={classNames(
        'relative flex rounded-full',
        { 'p-[1px] bg-btn-primary': isSynth },
        className,
      )}
    >
      {hasShadow && (
        <img
          alt={symbol}
          className={classNames(
            'absolute blur-xl transition-all',
            shadowPosition === 'corner' ? '-top-2 -left-2' : '-bottom-2',
          )}
          src={iconUrl}
          style={style}
        />
      )}

      {iconUrl ? (
        <Box
          center
          className={classNames(
            'rounded-full box-border overflow-hidden relative transition-all z-10',
            { [genericBgClasses[bgColor || 'secondary']]: bgColor },
          )}
          style={style}
        >
          <img
            alt={symbol}
            className="absolute inset-0 transition-all rounded-full"
            src={iconUrl}
            style={style}
          />
        </Box>
      ) : (
        <FallbackIcon size={iconSize} ticker={ticker} />
      )}

      {showChainIcon ? (
        <ChainIcon chain={chain} size={secondaryIconSize} style={secondaryIconPlacementStyle} />
      ) : badge ? (
        <Box
          center
          className="bg-light-bg-secondary dark:bg-dark-bg-secondary absolute z-10 scale-[65%] rounded-full"
          style={badgeContanerStyle}
        >
          <Text style={badgeStyle} textStyle="caption">
            {badge}
          </Text>
        </Box>
      ) : null}

      {isSynth && <Box className="absolute inset-0 bg-btn-primary blur-[6px] rounded-full" />}
    </div>
  );
};

const AssetIconMemo = memo(AssetIconComponent);

export const AssetIcon = memo(
  ({
    asset,
    bgColor,
    className,
    hasChainIcon = true,
    hasShadow = false,
    logoURI,
    secondaryIconPlacement,
    size = 40,
    badge,
    ticker,
  }: AssetIconProps) => {
    const {
      symbol,
      type,
      isSynth,
      ticker: assetTicker,
      chain,
    } = useMemo(() => asset || RUNEAsset, [asset]);

    const address = symbol.slice(assetTicker.length + 1).toLowerCase();
    const identifier = `${chain}.${assetTicker}`;

    const iconUrl = logoURI || tokenLogoURL({ address, identifier });

    return (
      <AssetIconMemo
        badge={badge}
        bgColor={bgColor}
        chain={chain}
        className={className}
        hasShadow={hasShadow}
        iconUrl={iconUrl}
        isSynth={isSynth}
        secondaryIconPlacement={secondaryIconPlacement}
        showChainIcon={hasChainIcon && (type !== 'Native' || FORCE_ICON_CHAINS.includes(chain))}
        size={size}
        symbol={symbol}
        ticker={ticker || assetTicker || ''}
      />
    );
  },
);
