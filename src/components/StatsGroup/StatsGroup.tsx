import classNames from 'classnames'

import { genericBgClasses } from '../constants'
import { Icon } from '../Icon'
import StatsLeaf from './StatsLeaf'
import { StatsGroupProps, borderPositions } from './types'

export const StatsGroup = (props: StatsGroupProps) => {
  const { stats, iconColor, iconName } = props

  return (
    <div className="flex flex-wrap relative max-w-[382px] min-w-[382px] gap-px">
      {stats.map(({ label, value }, index) => (
        <StatsLeaf
          key={`${label}-${value}`}
          label={label}
          value={value}
          borderNonePosition={borderPositions[index]}
        />
      ))}
      <div
        className={classNames(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
          genericBgClasses.secondary,
        )}
      >
        <Icon name={iconName} size={64} color={iconColor} />
        <div
          className={classNames(
            'w-12 h-12 absolute top-1/2 left-1/2 blur-2xl -z-1 opacity-40',
            genericBgClasses[iconColor],
          )}
        />
      </div>
    </div>
  )
}
