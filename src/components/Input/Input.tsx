import classNames from 'classnames';
import { Box, Icon, Typography } from 'components/Atomic';
import { InputProps } from 'components/Input/types';
import { forwardRef, RefObject, useRef } from 'react';

const DEFAULT_ICON_SIZE = 16;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      border,
      className,
      containerClassName,
      disabled,
      icon,
      onChange,
      placeholder,
      customPrefix,
      stretch,
      suffix,
      symbol,
      value,
      ...restProps
    }: InputProps,
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const focus = () => {
      const inputInstanceRef = (ref as RefObject<HTMLInputElement>) || inputRef;
      inputInstanceRef?.current?.focus?.();
    };

    return (
      <Box className={classNames(stretch ? 'w-full' : 'w-fit')}>
        <Box
          alignCenter
          className={classNames(
            'flex flex-row py-1.5 transition-all',
            'border-light-border-primary focus-within:border-dark-typo-gray dark:border-dark-border-primary hover:border-dark-typo-gray dark:hover:border-dark-typo-gray dark:focus-within:border-dark-typo-gray',
            'hover:!border-opacity-100',
            border ? 'border-solid' : 'border-none',
            stretch ? 'w-full' : 'w-fit',
            {
              'px-2 border rounded-2xl': border === 'rounded',
              'border-0 border-b': border === 'bottom',
            },
            containerClassName,
          )}
          onClick={focus}
        >
          {customPrefix &&
            (typeof customPrefix === 'string' ? (
              <Typography color="secondary" variant="caption-xs">
                {customPrefix}
              </Typography>
            ) : (
              customPrefix
            ))}

          {icon && (
            <Icon
              className={classNames('pr-2', {
                'pl-2': border === 'rounded',
              })}
              color="tertiary"
              name={icon}
              size={DEFAULT_ICON_SIZE}
            />
          )}

          <input
            className={classNames(
              'font-primary bg-transparent dark:placeholder-dark-typo-gray dark:text-dark-typo-primary placeholder-light-typo-gray text-light-typo-primary transition-colors',
              'border-none font-normal text-[14px] focus:outline-none',
              stretch ? 'w-full' : 'md:w-52',
              { 'md:w-48': icon && !stretch, 'cursor-not-allowed': disabled },
              className,
            )}
            disabled={disabled}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref || inputRef}
            value={value}
            {...restProps}
          />

          {symbol && (
            <Typography className="pr-2" variant="caption-xs">
              {symbol}
            </Typography>
          )}
          {suffix &&
            (typeof suffix === 'string' ? (
              <Typography color="secondary" variant="caption-xs">
                {suffix}
              </Typography>
            ) : (
              suffix
            ))}
        </Box>

        {error && (
          <Typography className="pt-2 pl-2" color="red" fontWeight="semibold" variant="caption">
            {error}
          </Typography>
        )}
      </Box>
    );
  },
);
