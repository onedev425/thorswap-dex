import { memo } from 'react'

import classNames from 'classnames'

import { Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { LeafProps, borderClasses } from './types'

export const StatsLeaf = memo(({ label, value, bnPosition }: LeafProps) => {
  return (
    <div
      className={classNames(
        'group flex flex-inline w-[calc(50%-2px)] min-h-[160px] rounded-[48px] text-center',
        'drop-shadow-box hover:bg-light-typo-gray hover:dark:bg-dark-typo-gray transition',
        genericBgClasses.secondary,
        borderClasses[bnPosition],
      )}
    >
      <div className="flex flex-col justify-center w-full gap-y-3">
        <Typography
          className="group-hover:text-white dark:group-hover:text-white"
          variant="caption"
          color="secondary"
          fontWeight="bold"
        >
          {label}
        </Typography>
        <Typography
          className="group-hover:text-white dark:group-hover:text-white"
          variant="h4"
        >
          {value}
        </Typography>
      </div>
    </div>
  )
})
