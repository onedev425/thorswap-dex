import { MouseEvent, useLayoutEffect, useRef } from 'react'

import classNames from 'classnames'

import { Typography } from 'components/Atomic'
import { Tooltip } from 'components/Atomic/Tooltip/Tooltip'

import { ButtonProps } from './types'
import { useButtonClasses } from './useButtonClasses'

export const Button = ({
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
  ...rest
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {
    backgroundClass,
    buttonClass,
    outlinedClass,
    typographyVariant,
    typographyClasses,
  } = useButtonClasses({ size, variant, isFancy, error })

  const isOutlined = type === 'outline'
  const isBorderless = type === 'borderless'

  const timeoutBlur = (timeout = 0) => {
    setTimeout(() => buttonRef.current?.blur(), timeout)
  }

  useLayoutEffect(() => {
    timeoutBlur(0)
  }, [])

  // It helps to remove focus state from button focus styles be applied only on `tab` select
  const handleClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    onClick?.(event)
    timeoutBlur()
  }

  return (
    <Tooltip content={tooltip} place={tooltipPlacement}>
      <button
        onMouseDown={() => timeoutBlur(300)}
        ref={buttonRef}
        className={classNames(
          'flex border border-solid items-center justify-center outline-none p-0 disabled:opacity-75 transition group',
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
        {...rest}
      >
        {startIcon && startIcon}

        {children && (
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
            variant={typographyVariant}
            transform={transform}
            fontWeight={isFancy ? 'semibold' : 'bold'}
            color={textColor}
          >
            {children}
          </Typography>
        )}

        {endIcon && endIcon}
      </button>
    </Tooltip>
  )
}
