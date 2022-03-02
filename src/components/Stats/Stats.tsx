import classNames from 'classnames'

import { Box, Card, Icon, Tooltip, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { StatsType, statsBgClasses } from './types'

export const Stats = ({
  tooltip,
  color,
  iconName,
  label,
  value,
}: StatsType) => {
  return (
    <Card
      className={classNames(
        'h-[120px] flex-initial gap-4 group transition flex-grow',
        statsBgClasses[color],
      )}
      stretch
    >
      <div
        className={classNames(
          'w-10 h-[72px] flex self-center items-center justify-center',
          'rounded-box group-hover:bg-light-bg-secondary',
          'dark:group-hover:bg-dark-bg-secondary transition',
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

      <Box justifyCenter col className="gap-4">
        <Box row className="gap-x-1">
          <Typography
            className="group-hover:text-dark-typo-primary transition"
            variant="caption"
            color="secondary"
          >
            {label}
          </Typography>

          <Tooltip content={tooltip}>
            <Icon
              size={16}
              className="group-hover:text-dark-typo-primary"
              color="secondary"
              name="infoCircle"
            />
          </Tooltip>
        </Box>

        <Typography
          className="group-hover:text-dark-typo-primary transition"
          transform="uppercase"
          variant="subtitle1"
        >
          {value}
        </Typography>
      </Box>
    </Card>
  )
}
