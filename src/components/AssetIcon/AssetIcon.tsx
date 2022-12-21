import { Asset } from '@thorswap-lib/multichain-core';
import classNames from 'classnames';
import { FallbackIcon } from 'components/AssetIcon/FallbackIcon';
import { Box, Typography } from 'components/Atomic';
import { tokenLogoURL } from 'helpers/logoURL';
import { memo, useMemo, useState } from 'react';

import { genericBgClasses } from '../constants';

import { ChainIcon } from './ChainIcon';
import { AssetIconProps, iconSizes } from './types';
import { getSecondaryIconPlacementStyle } from './utils';

const brokenAssetIcons = new Set<string>();

export const AssetIcon = memo(
  ({
    asset = Asset.RUNE(),
    bgColor,
    className,
    hasChainIcon = true,
    hasShadow = false,
    logoURI,
    secondaryIconPlacement = 'br',
    shadowPosition = 'corner',
    size = 40,
    badge,
  }: AssetIconProps) => {
    const iconSize = typeof size === 'number' ? size : iconSizes[size];
    const secondaryIconSize = iconSize * 0.52;
    const address = asset.symbol.slice(asset.ticker.length + 1).toLowerCase();
    const identifier = `${asset.chain}.${asset.ticker}`;
    const iconUrl = logoURI || tokenLogoURL({ address, identifier });
    const [fallback, setFallback] = useState(brokenAssetIcons.has(iconUrl));
    const style = useMemo(() => ({ width: iconSize, height: iconSize }), [iconSize]);

    const badgeStyle = useMemo(
      () => ({
        fontSize: secondaryIconSize * 0.9,
        padding: 3,
      }),
      [secondaryIconSize],
    );

    return (
      <div
        className={classNames(
          'relative flex rounded-full',
          { 'p-[1px] bg-btn-primary': asset.isSynth },
          className,
        )}
      >
        {hasShadow && (
          <img
            alt={asset.symbol}
            className={classNames(
              'absolute blur-xl transition-all',
              shadowPosition === 'corner' ? '-top-2 -left-2' : '-bottom-2',
            )}
            src={iconUrl}
            style={style}
          />
        )}

        {!fallback && iconUrl ? (
          <Box
            center
            className={classNames(
              'rounded-full box-border overflow-hidden relative transition-all z-10',
              { [genericBgClasses[bgColor || 'secondary']]: bgColor },
            )}
            style={style}
          >
            <img
              alt={asset.symbol}
              className="absolute inset-0 transition-all rounded-full"
              onError={() => {
                brokenAssetIcons.add(iconUrl);
                setFallback(true);
              }}
              src={iconUrl}
              style={style}
            />
          </Box>
        ) : (
          <FallbackIcon size={iconSize} ticker={asset.ticker} />
        )}

        {hasChainIcon && asset.type !== 'Native' ? (
          <ChainIcon
            chain={asset.chain}
            size={secondaryIconSize}
            style={getSecondaryIconPlacementStyle(secondaryIconPlacement, secondaryIconSize)}
          />
        ) : badge ? (
          <Box
            center
            className="bg-light-bg-secondary dark:bg-dark-bg-secondary absolute z-10 scale-[65%] rounded-full"
            style={{
              ...getSecondaryIconPlacementStyle(secondaryIconPlacement, secondaryIconSize * 1.8),
              width: secondaryIconSize * 1.8,
              height: secondaryIconSize * 1.8,
            }}
          >
            <Typography style={badgeStyle} variant="caption">
              {badge}
            </Typography>
          </Box>
        ) : null}

        {asset.isSynth && (
          <Box className="absolute inset-0 bg-btn-primary blur-[6px] rounded-full" />
        )}
      </div>
    );
  },
);
