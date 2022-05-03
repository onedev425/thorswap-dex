import classNames from 'classnames'

import { AssetIcon } from './AssetIcon'
import { iconSizes, AssetLpIconProps } from './types'

export const AssetLpIcon = ({
  asset1,
  asset2,
  inline,
  size = 40,
  hasShadow = false,
  ...styleProps
}: AssetLpIconProps) => {
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
          hasChainIcon={false}
          className="rounded-full"
          asset={asset1}
          size={size}
          {...styleProps}
        />
      </div>

      <div className="transition-all" style={{ marginLeft: -pairIconOffset }}>
        <AssetIcon
          hasChainIcon={false}
          shadowPosition="center"
          hasShadow={hasShadow}
          className={classNames('rounded-full', {
            'translate-y-2': !inline,
          })}
          asset={asset2}
          size={size}
          {...styleProps}
        />
      </div>
    </div>
  )
}
