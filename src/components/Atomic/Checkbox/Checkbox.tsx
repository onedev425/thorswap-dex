import { Text } from '@chakra-ui/react';
import classNames from 'classnames';
import { Box, Icon } from 'components/Atomic';
import { ReactNode, useCallback } from 'react';

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: ReactNode;
  className?: string;
};

export const Checkbox = ({ value, onValueChange, label, className }: Props) => {
  const handleChange = useCallback(
    ({ target }: any) => {
      onValueChange(target?.checked || !value);
    },
    [onValueChange, value],
  );

  return (
    <Box center className={className} onClick={handleChange}>
      <Box center className="pr-2">
        <input
          checked={value}
          className={classNames(
            'bg-light-bg-primary dark:bg-dark-bg-primary appearance-none transition duration-200 h-6 w-6 rounded-md focus:outline-none cursor-pointer',
          )}
          onChange={handleChange}
          type="checkbox"
        />

        <Icon
          className={classNames('opacity-0 pl-0.5 pt-0.5 absolute pointer-events-none', {
            '!opacity-100': value,
          })}
          color="primary"
          name="checkmark"
          size={18}
        />
      </Box>

      {typeof label === 'string' ? (
        <Text as="label" className="cursor-pointer" fontWeight="semibold" variant="secondary">
          {label}
        </Text>
      ) : (
        label || null
      )}
    </Box>
  );
};
