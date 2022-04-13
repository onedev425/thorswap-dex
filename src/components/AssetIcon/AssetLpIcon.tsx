import classNames from 'classnames'

import { AssetIcon } from './AssetIcon'
import { iconSizes, AssetLpIconProps } from './types'

export const AssetLpIcon = (props: AssetLpIconProps) => {
  const {
    asset1,
    asset2,
    inline,
    size = 40,
    hasShadow = false,
    ...styleProps
  } = props
  const iconSize = typeof size === 'number' ? size : iconSizes[size]
  const pairIconOffset = iconSize * 0.45

  return (
    <div className="flex">
      <div
        className={classNames(
          'border-light-bg-primary dark:border-dark-bg-primary z-10',
          { '-translate-y-2': !inline },
        )}
      >
        <AssetIcon
          className={classNames('rounded-full', {
            'shadow-leftTicker': hasShadow,
          })}
          asset={asset1}
          size={size}
          {...styleProps}
        />
      </div>

      <div className="transition-all" style={{ marginLeft: -pairIconOffset }}>
        <AssetIcon
          className={classNames('rounded-full', {
            'translate-y-2': !inline,
            'shadow-rightTicker': hasShadow,
          })}
          asset={asset2}
          size={size}
          {...styleProps}
        />
      </div>
    </div>
  )
}
