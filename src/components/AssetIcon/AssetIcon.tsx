import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { Typography } from 'components/Atomic'
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
  secondaryIconPlacement = 'br',
}: AssetIconProps) => {
  const iconSize = typeof size === 'number' ? size : iconSizes[size]
  const iconUrl = getAssetIconUrl(asset)
  const secondaryIconSize = hasChainIcon ? iconSize * 0.4 : 0

  return (
    <div className="relative flex">
      <div
        style={{ width: iconSize, height: iconSize }}
        className={classNames(
          className,
          'flex rounded-full items-center justify-center p-2 box-border overflow-hidden relative',
          { [genericBgClasses[bgColor as 'blue']]: bgColor },
        )}
      >
        {iconUrl ? (
          <img
            style={{ width: iconSize, height: iconSize }}
            className="absolute inset-0 object-cover"
            src={iconUrl}
            alt={asset.symbol}
          />
        ) : (
          <Typography variant="caption">{asset.symbol}</Typography>
        )}
      </div>

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
