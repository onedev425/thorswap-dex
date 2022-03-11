import { SupportedChain } from '@thorswap-lib/multichain-sdk'
import classNames from 'classnames'

import { Box } from 'components/Atomic'
import { ChainIcon } from 'components/ChainIcon'

import { genericBgClasses } from '../constants'
import { iconSizes, AssetIconProps } from './types'
import {
  getAssetIconUrl,
  // getIntFromName,
  getSecondaryIconPlacementStyle,
  // rainbowStop,
} from './utils'

export const AssetIcon = ({
  className,
  asset,
  size = 40,
  bgColor,
  hasChainIcon = false,
  hasShadow = false,
  secondaryIconPlacement = 'br',
}: AssetIconProps) => {
  const iconSize = typeof size === 'number' ? size : iconSizes[size]
  const iconUrl = getAssetIconUrl(asset)
  const secondaryIconSize = hasChainIcon ? iconSize * 0.4 : 0

  // fallback icon
  // const tickerNums = getIntFromName(asset.ticker)
  // const fallbackBgImg = `linear-gradient(45deg, ${rainbowStop(
  //   tickerNums[0],
  // )}, ${rainbowStop(tickerNums[1])})`

  return (
    <div
      className={classNames(
        'relative flex rounded-full',
        { 'shadow-rightTicker': hasShadow },
        className,
      )}
    >
      <Box
        className={classNames(
          'rounded-full box-border overflow-hidden relative',
          { [genericBgClasses[bgColor as 'blue']]: bgColor },
        )}
        center
        width={iconSize}
        height={iconSize}
      >
        <img
          style={{ width: iconSize, height: iconSize }}
          className="absolute inset-0 object-cover"
          src={iconUrl}
          alt={asset.symbol}
        />
      </Box>

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
