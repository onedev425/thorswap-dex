import classNames from 'classnames';
import { Box, Card, Icon, Tooltip, Typography } from 'components/Atomic';
import { genericBgClasses } from 'components/constants';
import { memo } from 'react';

import { statsBgClasses, StatsType } from './types';

export const Stats = memo(({ tooltip, color, iconName, label, value }: StatsType) => {
  return (
    <Card
      stretch
      className={classNames(
        'h-[120px] flex-initial gap-4 group transition flex-grow',
        statsBgClasses[color],
      )}
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
          className="transition group-hover:text-dark-typo-primary"
          color={color}
          name={iconName}
        />
      </div>

      <Box col justifyCenter className="gap-4">
        <Box row className="gap-x-1">
          <div className="grid">
            <Typography
              className="overflow-hidden transition group-hover:text-dark-typo-primary text-ellipsis whitespace-nowrap"
              color="secondary"
              variant="caption"
            >
              {label}
            </Typography>
          </div>

          {tooltip && (
            <Tooltip content={tooltip}>
              <Icon
                className="group-hover:text-dark-typo-primary"
                color="secondary"
                name="infoCircle"
                size={16}
              />
            </Tooltip>
          )}
        </Box>

        <div className="grid">
          <Typography
            className="overflow-hidden transition group-hover:text-dark-typo-primary text-ellipsis whitespace-nowrap"
            transform="uppercase"
            variant="subtitle1"
          >
            {value}
          </Typography>
        </div>
      </Box>
    </Card>
  );
});
