import classNames from 'classnames'

import { Icon } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import StatsLeaf from './StatsLeaf'
import { StatsGroupProps, borderPositions } from './types'

export const StatsGroup = (props: StatsGroupProps) => {
  const { stats, iconColor, iconName } = props

  return (
    <div className="relative flex flex-wrap gap-px">
      {stats.map(({ label, value }, index) => (
        <StatsLeaf
          key={`${label}-${value}`}
          label={label}
          value={value}
          bnPosition={borderPositions[index]}
        />
      ))}
      <div
        className={classNames(
          'flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16',
          genericBgClasses[iconColor],
        )}
      >
        <Icon name={iconName} size={20} color="white" />
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
