import classNames from 'classnames';
import { Icon, Typography } from 'components/Atomic';
import { Tooltip } from 'components/Atomic/Tooltip/Tooltip';
import { MouseEvent, useLayoutEffect, useRef } from 'react';

import { ButtonProps } from './types';
import { useButtonClasses } from './useButtonClasses';

export const OldButton = ({
  className = '',
  disabled = false,
  size = 'sm',
  startIcon,
  endIcon,
  textColor,
  transform = 'capitalize',
  type = 'default',
  stretch = false,
  variant = 'primary',
  children,
  onClick,
  tooltip,
  tooltipPlacement,
  loading,
  isFancy = false,
  error = false,
  tooltipClasses = '',
  ...rest
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { backgroundClass, buttonClass, outlinedClass, typographyVariant, typographyClasses } =
    useButtonClasses({ size, variant, isFancy, error });

  const isOutlined = type === 'outline';
  const isBorderless = type === 'borderless';

  const timeoutBlur = (timeout = 0) => {
    setTimeout(() => buttonRef.current?.blur(), timeout);
  };

  useLayoutEffect(() => {
    timeoutBlur(0);
  }, []);

  // It helps to remove focus state from button focus styles be applied only on `tab` select
  const handleClick = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    onClick?.(event);
    timeoutBlur();
  };

  return (
    <Tooltip className={tooltipClasses} content={tooltip} place={tooltipPlacement}>
      <button
        className={classNames(
          'bg-btn-primary-light dark:bg-btn-primary flex border border-solid items-center justify-center outline-none p-0',
          'transition group disabled:opacity-75 dark:disabled:opacity-60',
          buttonClass,
          disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer',
          {
            [backgroundClass]: type === 'default',
            [outlinedClass]: isOutlined || isBorderless,
            'w-full': stretch,
            '!border-transparent': !isOutlined,
          },
          className,
        )}
        disabled={disabled || loading}
        onClick={handleClick}
        onMouseDown={() => timeoutBlur(300)}
        ref={buttonRef}
        type="button"
        {...rest}
      >
        {loading ? <Icon spin color="primary" name="loader" size={24} /> : null}
        {loading ? null : startIcon && startIcon}

        {loading
          ? null
          : children && (
              <Typography
                className={classNames(
                  'transition !no-underline',
                  isOutlined || isBorderless || variant === 'tint'
                    ? 'text-light-typo-primary dark:text-dark-typo-primary'
                    : typographyClasses,
                  {
                    'ml-2': startIcon,
                    'mr-2': endIcon,
                  },
                )}
                color={textColor}
                fontWeight={isFancy ? 'semibold' : 'bold'}
                transform={transform}
                variant={typographyVariant}
              >
                {children}
              </Typography>
            )}

        {loading ? null : endIcon && endIcon}
      </button>
    </Tooltip>
  );
};
