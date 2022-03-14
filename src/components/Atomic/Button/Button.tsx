import { MouseEvent, useRef } from 'react'

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
  ...rest
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {
    backgroundActiveClass,
    backgroundClass,
    buttonClass,
    outlinedClass,
    typographyVariant,
    typographyOutlineClass,
  } = useButtonClasses({ size, variant })

  const isOutlined = type === 'outline'
  const isBorderless = type === 'borderless'

  // It helps to remove focus state from button focus styles be applied only on `tab` select
  const handleClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    onClick?.(event)
    buttonRef.current?.blur()
  }

  return (
    <Tooltip content={tooltip}>
      <button
        ref={buttonRef}
        className={classNames(
          'flex border items-center justify-center outline-none p-0 disabled:opacity-75 duration-300',
          buttonClass,
          className,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          isBorderless || isOutlined
            ? 'bg-transparent active:bg-transparent'
            : backgroundClass,
          {
            'border-transparent': isBorderless,
            'w-full': stretch,
            [outlinedClass]: isOutlined,
            [backgroundActiveClass]: !(disabled || isBorderless || isOutlined),
          },
        )}
        disabled={disabled}
        onClick={handleClick}
        {...rest}
      >
        {startIcon && startIcon}

        {children && (
          <Typography
            className={classNames(
              'duration-150',
              isOutlined || isBorderless
                ? 'text-light-typo-primary dark:text-dark-typo-primary'
                : 'text-light-typo-secondary dark:text-dark-typo-secondary',
              { [typographyOutlineClass]: isOutlined || isBorderless },
              {
                'ml-2': startIcon,
                'mr-2': endIcon,
              },
            )}
            variant={typographyVariant}
            transform={transform}
            fontWeight="bold"
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
