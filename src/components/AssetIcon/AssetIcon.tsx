import { useState } from 'react'

import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { FallbackIcon } from 'components/AssetIcon/FallbackIcon'
import { Box } from 'components/Atomic'
import { ChainIcon } from 'components/ChainIcon'

import { genericBgClasses } from '../constants'
import { iconSizes, AssetIconProps } from './types'
import { getAssetIconUrl, getSecondaryIconPlacementStyle } from './utils'

export const AssetIcon = ({
  className,
  asset,
  size = 40,
  bgColor,
  hasChainIcon = false,
  hasShadow = false,
  secondaryIconPlacement = 'br',
}: AssetIconProps) => {
  const [hasError, setHasError] = useState(false)
  const iconSize = typeof size === 'number' ? size : iconSizes[size]
  const iconUrl = getAssetIconUrl(asset)
  const secondaryIconSize = hasChainIcon ? iconSize * 0.4 : 0

  return (
    <div className={classNames('relative flex rounded-full', className)}>
      {hasShadow && (
        <img
          style={{ width: iconSize, height: iconSize }}
          className="absolute blur-xl -top-2 -left-2 transition-all"
          src={iconUrl}
          alt={asset.symbol}
        />
      )}
      {iconUrl && !hasError ? (
        <Box
          className={classNames(
            'rounded-full box-border overflow-hidden relative transition-all',
            { [genericBgClasses[bgColor || 'secondary']]: bgColor },
          )}
          center
          width={iconSize}
          height={iconSize}
        >
          <img
            className="absolute inset-0 object-cover transition-all"
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
          className="absolute"
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
    </div>
  )
}
