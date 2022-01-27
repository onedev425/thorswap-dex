import classNames from 'classnames'

import { genericBgClasses } from '../constants'
import { Typography } from '../Typography'
import { LeafProps } from './types'

const StatsLeaf = (props: LeafProps) => {
  const { label, value, borderClass } = props
  return (
    <div
      className={classNames(
        'flex flex-inline max-w-[150px] w-[calc(50%-2px)] min-h-[160px] rounded-[48px] text-center px-5',
        'drop-shadow-box hover:bg-light-bg-primary hover:dark:bg-dark-bg-primary transition',
        genericBgClasses.secondary,
        borderClass,
      )}
    >
      <div className="flex flex-col justify-center w-full gap-y-3">
        <Typography variant="caption" color="secondary" fontWeight="bold">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          $ {value} B
        </Typography>
      </div>
    </div>
  )
}

export default StatsLeaf
