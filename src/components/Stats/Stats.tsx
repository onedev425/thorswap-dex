import classNames from 'classnames'

import { Card } from '../Card'
import { genericBgClasses } from '../constants'
import { Icon } from '../Icon'
import { Typography } from '../Typography'
import { StatsType, statsBgClasses } from './types'

export const Stats = (props: StatsType) => {
  const { color, iconName, label, value } = props

  return (
    <Card
      className={classNames(
        'w-[185px] flex-initial gap-4 group transition',
        statsBgClasses[color],
      )}
      stretch
    >
      <div
        className={classNames(
          'w-10 h-[72px] flex items-center justify-center rounded-box group-hover:bg-light-bg-secondary dark:group-hover:bg-dark-bg-secondary transition',
          genericBgClasses[color],
          'bg-opacity-10 group-hover:bg-opacity-10 dark:group-hover:bg-opacity-10',
        )}
      >
        <Icon
          color={color}
          name={iconName}
          className="group-hover:text-dark-typo-primary transition"
        />
      </div>
      <div className="flex flex-col justify-center gap-4">
        <Typography
          className="group-hover:text-dark-typo-primary transition"
          fontWeight="semibold"
          variant="caption"
          color="secondary"
        >
          {label}
        </Typography>
        <Typography
          className="group-hover:text-dark-typo-primary transition"
          transform="uppercase"
          fontWeight="bold"
          variant="h5"
        >
          {value}
        </Typography>
      </div>
    </Card>
  )
}
