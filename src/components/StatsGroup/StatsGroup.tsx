import classNames from 'classnames'

import { genericBgClasses } from '../constants'
import { Icon } from '../Icon'
import StatsLeaf from './StatsLeaf'
import { StatsGroupProps } from './types'

export const StatsGroup = (props: StatsGroupProps) => {
  const {
    totalVolume,
    depositVolume,
    swapVolume,
    withdrawVolume,
    iconColor,
    iconName,
  } = props

  return (
    <div className="flex flex-wrap relative max-w-[382px] min-w-[382px] gap-px">
      <StatsLeaf
        label="Total Volume"
        value={totalVolume}
        borderClass="rounded-br-none"
      />
      <StatsLeaf
        label="Deposit Volume"
        value={depositVolume}
        borderClass="rounded-bl-none"
      />
      <StatsLeaf
        label="Swap Volume"
        value={swapVolume}
        borderClass="rounded-tr-none"
      />
      <StatsLeaf
        label="Withdraw Volume"
        value={withdrawVolume}
        borderClass="rounded-tl-none"
      />
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
