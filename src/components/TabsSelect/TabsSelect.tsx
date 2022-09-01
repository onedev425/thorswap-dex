import classNames from 'classnames';
import { Box, Button, Typography } from 'components/Atomic';
import { TabSelectType } from 'components/TabsSelect/types';
import { memo } from 'react';

type Props = {
  title?: string;
  titleWidth?: string;
  tabs: TabSelectType[];
  tabWidth?: string;
  value: string;
  onChange: (val: string) => void;
};

export const TabsSelect = memo(
  ({ title, titleWidth, tabs, tabWidth, value: selectedValue, onChange }: Props) => {
    return (
      <Box alignCenter flex={1}>
        {!!title && (
          <Box style={titleWidth ? { width: titleWidth } : {}}>
            <Typography className="px-2" color="secondary" variant="caption">
              {title}
            </Typography>
          </Box>
        )}

        <Box
          alignCenter
          row
          className={classNames(
            'border-light-gray-light dark:border-dark-gray-light hover:border-light-border-primary dark:hover:border-dark-gray-primary',
            'px-1 py-1 rounded-2xl border border-solid transition',
          )}
          flex={1}
        >
          <Box
            className={classNames('flex-wrap self-stretch', {
              'gap-1': !tabWidth,
            })}
            flex={1}
            justify="between"
          >
            {tabs.map(({ value, label }) => (
              <Button
                className={classNames('self-stretch', {
                  'flex-1': !tabWidth,
                  '!bg-opacity-100 dark:!bg-opacity-50': value === selectedValue,
                })}
                key={value}
                onClick={() => onChange(value)}
                style={tabWidth ? { width: tabWidth } : {}}
                transform="none"
                type={value === selectedValue ? 'default' : 'borderless'}
                variant={value === selectedValue ? 'primary' : 'tint'}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
    );
  },
);
