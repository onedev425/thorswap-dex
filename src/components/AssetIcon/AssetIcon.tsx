import { memo, useState } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { FallbackIcon } from 'components/AssetIcon/FallbackIcon'
import { Box } from 'components/Atomic'
import { ChainIcon } from 'components/ChainIcon'

import { genericBgClasses } from '../constants'
import { iconSizes, AssetIconProps } from './types'
import { getAssetIconUrl, getSecondaryIconPlacementStyle } from './utils'

export const AssetIcon = memo(
  ({
    className,
    asset,
    size = 40,
    bgColor,
    hasChainIcon = true,
    hasShadow = false,
    secondaryIconPlacement = 'br',
    shadowPosition = 'corner',
  }: AssetIconProps) => {
    const [hasError, setHasError] = useState(false)
    const iconSize = typeof size === 'number' ? size : iconSizes[size]
    const iconUrl = getAssetIconUrl(asset)
    const secondaryIconSize = iconSize * 0.4
    const isTHOR = asset.ticker === 'THOR' || asset.ticker === 'VTHOR'

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
            style={{ width: iconSize, height: iconSize }}
            className={classNames(
              'absolute blur-xl transition-all',
              shadowPosition === 'corner' ? '-top-2 -left-2' : '-bottom-2',
            )}
            src={iconUrl}
            alt={asset.symbol}
          />
        )}

        {iconUrl && (!hasError || isTHOR) ? (
          <Box
            className={classNames(
              'rounded-full box-border overflow-hidden relative transition-all z-10',
              { [genericBgClasses[bgColor || 'secondary']]: bgColor },
            )}
            center
            style={{ width: iconSize, height: iconSize }}
          >
            <img
              className="absolute inset-0 transition-all rounded-full"
              src={iconUrl}
              alt={asset.symbol}
              style={{ width: iconSize, height: iconSize }}
              onError={() => setHasError(true)}
            />
          </Box>
        ) : (
          <FallbackIcon ticker={asset.ticker} size={iconSize} />
        )}

        {hasChainIcon && asset.type !== 'Native' && (
          <div
            className="absolute z-10"
            style={getSecondaryIconPlacementStyle(
              secondaryIconPlacement,
              secondaryIconSize,
            )}
          >
            <ChainIcon
              chain={asset.chain as SupportedChain}
              size={secondaryIconSize}
            />
          </div>
        )}

        {asset.isSynth && (
          <Box className="absolute inset-0 bg-btn-primary blur-[6px] rounded-full"></Box>
        )}
      </div>
    )
  },
)
