import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button } from 'components/Atomic';
import { TabSelectType } from 'components/TabsSelect/types';
import { memo } from 'react';

type Props = {
  title?: string;
  titleWidth?: string;
  tabs: TabSelectType[];
  tabWidth?: string;
  value: string;
  onChange: (value: string) => void;
  buttonClasses?: string;
};

export const TabsSelect = memo(
  ({ title, titleWidth, tabs, tabWidth, value: selectedValue, onChange, buttonClasses }: Props) => {
    return (
      <Box alignCenter flex={1}>
        {!!title && (
          <Box style={titleWidth ? { width: titleWidth } : {}}>
            <Text className="px-2" textStyle="caption" variant="secondary">
              {title}
            </Text>
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
            {tabs.map(({ value, label, tooltip }) => (
              <Button
                className={classNames(
                  'self-stretch',
                  {
                    'flex-1': !tabWidth,
                    '!bg-opacity-100 dark:!bg-opacity-50': value === selectedValue,
                  },
                  buttonClasses,
                )}
                key={value}
                onClick={() => onChange(value)}
                style={tabWidth ? { width: tabWidth } : {}}
                textTransform="none"
                tooltip={tooltip}
                variant={value === selectedValue ? 'primary' : 'borderlessTint'}
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
