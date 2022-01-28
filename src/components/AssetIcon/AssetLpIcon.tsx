import classNames from 'classnames'

import { AssetIcon } from './AssetIcon'
import { AssetLpIconProps } from './types'

export const AssetLpIcon = (props: AssetLpIconProps) => {
  const {
    asset1Name,
    asset2Name,
    asset1BgColor = 'blue',
    asset2BgColor = 'green',
    inline,
    ...styleProps
  } = props
  const size = props?.size || 40
  const pairIconOffset = size * 0.45

  return (
    <div className="flex">
      <div
        className={classNames(
          'z-10 relative border-2 border-solid rounded-full border-light-bg-primary dark:border-dark-bg-primary',
          { '-translate-y-2': !inline },
        )}
      >
        <AssetIcon name={asset1Name} bgColor={asset1BgColor} {...styleProps} />
      </div>

      <div style={{ marginLeft: -pairIconOffset }}>
        <AssetIcon
          name={asset2Name}
          bgColor={asset2BgColor}
          {...styleProps}
          className={classNames('relative', { 'translate-y-2': !inline })}
        />
      </div>
    </div>
  )
}
