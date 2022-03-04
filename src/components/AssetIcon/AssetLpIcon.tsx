import classNames from 'classnames'

import { AssetIcon } from './AssetIcon'
import { iconSizes, AssetLpIconProps } from './types'

export const AssetLpIcon = (props: AssetLpIconProps) => {
  const {
    asset1,
    asset2,
    asset1BgColor = 'blue',
    asset2BgColor = 'green',
    inline,
    size = 40,
    ...styleProps
  } = props
  const iconSize = typeof size === 'number' ? size : iconSizes[size]
  const pairIconOffset = iconSize * 0.45

  return (
    <div className="flex">
      <div
        className={classNames(
          'rounded-full border-light-bg-primary dark:border-dark-bg-primary',
          { '-translate-y-2': !inline },
        )}
      >
        <AssetIcon asset={asset1} bgColor={asset1BgColor} {...styleProps} />
      </div>

      <div style={{ marginLeft: -pairIconOffset }}>
        <AssetIcon
          className={classNames({ 'translate-y-2': !inline })}
          asset={asset2}
          bgColor={asset2BgColor}
          {...styleProps}
        />
      </div>
    </div>
  )
}
