import classNames from 'classnames';
import { Box, Button, DropdownMenu, Typography } from 'components/Atomic';
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
            className={classNames('w-20', size === 'md' ? 'h-10' : 'h-8', {
              '!bg-opacity-100 dark:!bg-opacity-50': index === activeIndex,
            })}
            key={option}
            onClick={() => onHandleChange(index)}
            type={activeIndex === index ? 'default' : 'outline'}
            variant={activeIndex === index ? 'primary' : 'tint'}
          >
            <Typography
              className="leading-4"
              transform="capitalize"
              variant={size === 'md' ? 'caption' : 'caption-xs'}
            >
              {option}
            </Typography>
          </Button>
        ))}
      </Box>

      <Box className={disableDropdown ? 'hidden' : 'md:hidden'}>
        <DropdownMenu
          menuItems={dropdownOptions}
          onChange={onDropdownChange}
          openComponent={
            <Box alignCenter className="gap-2 w-fit">
              <Typography variant="caption">{options[activeIndex]}</Typography>
            </Box>
          }
          value={options[activeIndex]}
        />
      </Box>
    </>
  );
};
