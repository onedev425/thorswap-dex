import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Button, DropdownMenu } from 'components/Atomic';
import { useCallback, useMemo } from 'react';

type Props = {
  className?: string;
  options: string[];
  activeIndex?: number;
  onChange?: (selectedIndex: number) => void;
  size?: 'md' | 'sm';
  disableDropdown?: boolean;
};

export const Select = ({
  className,
  options,
  disableDropdown,
  activeIndex = 0,
  onChange,
  size = 'md',
}: Props) => {
  const onHandleChange = useCallback(
    (selectedIndex: number) => {
      onChange?.(selectedIndex);
    },
    [onChange],
  );
  const dropdownOptions = useMemo(
    () => options.map((o, idx) => ({ value: String(idx), label: o })),
    [options],
  );

  const onDropdownChange = useCallback(
    (value: string) => {
      onChange?.(Number(value));
    },
    [onChange],
  );

  return (
    <>
      <Box className={classNames('gap-2', { 'hidden md:flex': !disableDropdown }, className)}>
        {options.map((option, index) => (
          <Button
            className={classNames('w-21', size === 'md' ? 'h-10' : 'h-8', {
              '!bg-opacity-100 dark:!bg-opacity-50': index === activeIndex,
            })}
            key={option}
            onClick={() => onHandleChange(index)}
            variant={activeIndex === index ? 'primary' : 'outlineTint'}
          >
            <Text
              className="leading-4"
              textStyle={size === 'md' ? 'caption' : 'caption-xs'}
              textTransform="capitalize"
            >
              {option}
            </Text>
          </Button>
        ))}
      </Box>

      <Box className={disableDropdown ? 'hidden' : 'md:hidden'}>
        <DropdownMenu
          menuItems={dropdownOptions}
          onChange={onDropdownChange}
          openComponent={
            <Box alignCenter className="gap-2 w-fit">
              <Text textStyle="caption">{options[activeIndex]}</Text>
            </Box>
          }
          value={options[activeIndex]}
        />
      </Box>
    </>
  );
};
