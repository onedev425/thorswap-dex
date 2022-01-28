import classNames from 'classnames'

import { Typography } from 'components/Typography'

import { genericBgClasses } from '../constants'
import { AssetIconProps } from './types'
import { getAssetIconUrl, getSecondaryIconPlacementStyle } from './utils'

export const AssetIcon = (props: AssetIconProps) => {
  const {
    className,
    size = 40,
    bgColor = 'blue',
    name,
    secondaryIconName,
    secondaryIconPlacement = 'bl',
  } = props

  const iconUrl = getAssetIconUrl(name)
  const secondaryIconSize = secondaryIconName ? size * 0.4 : 0

  return (
    <div className="flex relative">
      <div
        style={{ width: size, height: size }}
        className={classNames(
          className,
          'flex rounded-full items-center justify-center p-2 box-border overflow-hidden relative',
          { [genericBgClasses[bgColor]]: bgColor },
        )}
      >
        {iconUrl ? (
          <img
            style={{ width: size, height: size }}
            className="absolute inset-0 object-cover"
            src={iconUrl}
            alt={name}
          />
        ) : (
          <Typography variant="caption">{name}</Typography>
        )}
      </div>
      {secondaryIconName && (
        <div
          className="absolute"
          style={getSecondaryIconPlacementStyle(
            secondaryIconPlacement,
            secondaryIconSize,
          )}
        >
          <AssetIcon name={secondaryIconName} size={secondaryIconSize} />
        </div>
      )}
    </div>
  )
}
