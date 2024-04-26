import type { SystemStyleObject } from '@chakra-ui/react';
import { Text, useTheme } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button } from 'components/Atomic';
import type { TabSelectType } from 'components/TabsSelect/types';
import { memo } from 'react';

type Props = {
  title?: string;
  titleWidth?: string;
  tabs: TabSelectType[];
  tabWidth?: string;
  value: string;
  onChange: (value: string) => void;
  buttonStyle?: SystemStyleObject;
};

export const TabsSelect = memo(
  ({
    title,
    titleWidth,
    tabs,
    tabWidth,
    value: selectedValue,
    onChange,
    buttonStyle,
  }: Props) => {
    const theme = useTheme();
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
              'gap-0': !tabWidth,
            })}
            flex={1}
            justify="between"
          >
            {tabs.map(({ value, label, tooltip, disabled }) => (
              <Button
                _dark={{
                  bgColor: value === selectedValue && theme.colors.brand.btnPrimary + '80',
                }}
                _light={{ color: theme.colors.brand.light.textPrimary }}
                alignSelf="stretch"
                flex={!tabWidth ? 1 : 'initial'}
                key={value}
                onClick={() => onChange(value)}
                style={tabWidth ? { width: tabWidth } : {}}
                sx={buttonStyle}
                textTransform="none"
                tooltip={tooltip}
                variant={value === selectedValue ? 'primary' : 'borderlessTint'}
                tooltipWrapperClasses={classNames('w-[17%]')}
                width={'100%'}
                disabled={disabled}
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
