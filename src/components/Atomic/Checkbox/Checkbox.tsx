import classNames from 'classnames';
import { Box, Icon, Typography } from 'components/Atomic';
import { useCallback } from 'react';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  className?: string;
};

export const Checkbox = ({ value, onValueChange, label, className }: Props) => {
  const handleChange = useCallback(
    ({ target }: ToDo) => {
      onValueChange(target?.checked || !value);
    },
    [onValueChange, value],
  );

  return (
    <Box center className={className} onClick={handleChange}>
      <Typography
        className="cursor-pointer"
        color="secondary"
        component="label"
        fontWeight="semibold"
      >
        {label}
      </Typography>

      <Box center className="pr-2">
        <input
          checked={value}
          className={classNames(
            'appearance-none transition duration-200 h-6 w-6 rounded-md focus:outline-none cursor-pointer',
            { 'bg-light-bg-secondary dark:bg-dark-bg-primary': value },
          )}
          onChange={handleChange}
          type="checkbox"
        />

        {value && (
          <Icon
            className="pl-0.5 pt-0.5 absolute pointer-events-none"
            color="primary"
            name="checkmark"
            size={18}
          />
        )}
      </Box>
    </Box>
  );
};
