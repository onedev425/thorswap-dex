import { memo } from 'react'

import classNames from 'classnames'

import { Box, Icon, Typography } from 'components/Atomic'
import { genericBgClasses } from 'components/constants'

import { StatsLeaf } from './StatsLeaf'
import { StatsGroupProps, borderPositions } from './types'

export const StatsGroup = memo(
  ({ iconColor, stats, title, iconName }: StatsGroupProps) => {
    return (
      <Box col>
        <Box row className="pb-8">
          <Typography variant="h3" color="primary" fontWeight="extrabold">
            {title}
          </Typography>
        </Box>

        <Box flex={1} className="relative flex-wrap gap-px">
          {stats.map(({ label, value }, index) => (
            <StatsLeaf
              key={`${label}-${value}`}
              label={label}
              value={value}
              bnPosition={borderPositions[index]}
            />
          ))}

          <Box
            flex={1}
            center
            className={classNames(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-16 h-16',
              genericBgClasses[iconColor],
            )}
          >
            <Icon name={iconName} size={20} color="white" />
            <Box
              className={classNames(
                'w-12 h-12 absolute top-1/2 left-1/2 blur-2xl -z-1 opacity-40',
                genericBgClasses[iconColor],
              )}
            />
          </Box>
        </Box>
      </Box>
    )
  },
)
