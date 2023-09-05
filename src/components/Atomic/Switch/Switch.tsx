import { Text } from '@chakra-ui/react';
import classNames from 'classnames';

import type { SwitchProps } from './types';

export const Switch = ({
  className = '',
  selectedText = '',
  unselectedText = '',
  disabled = false,
  checked = false,
  onChange,
  ...rest
}: SwitchProps) => {
  return (
    <span
      className={classNames(
        'inline-block relative h-10 w-28',
        disabled ? 'cursor-not-allowed bg-opacity-30 border-opacity-30' : 'cursor-pointer',
        className,
      )}
    >
      <span
        className={classNames(
          'rounded-2xl h-full block w-full bg-light-gray-light dark:bg-dark-bg-primary',
        )}
      >
        <span
          className={classNames(
            checked ? 'translate-x-0 bg-navy' : 'translate-x-14 bg-dark-gray-primary',
            'absolute before:block flex items-center justify-center h-10 w-14 rounded-2xl',
          )}
          style={{
            transition: 'transform 100ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Text fontWeight="semibold" variant="primary">
            {checked ? selectedText : unselectedText}
          </Text>
        </span>

        <span className="flex items-center justify-around h-full opacity-60">
          <Text
            className={classNames({ invisible: checked })}
            fontWeight="semibold"
            variant="secondary"
          >
            {selectedText}
          </Text>

          <Text
            className={classNames({ invisible: !checked })}
            fontWeight="semibold"
            variant="secondary"
          >
            {unselectedText}
          </Text>
        </span>
      </span>

      <input
        checked={checked}
        className={classNames(
          'absolute w-full h-full z-10 m-0 rounded-lg top-0 opacity-0',
          disabled ? 'cursor-not-allowed bg-opacity-30 border-opacity-30' : 'cursor-pointer',
        )}
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
        {...rest}
      />
    </span>
  );
};
