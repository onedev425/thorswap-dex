import { MouseEvent, useRef } from 'react'

import classNames from 'classnames'

import { Typography } from 'components/Atomic'

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
  variant = 'primary',
  children,
  onClick,
  ...rest
}: ButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const {
    backgroundActiveClass,
    backgroundClass,
    buttonClass,
    outlinedClass,
    typographyVariant,
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
    <div className="group">
      <button
        ref={buttonRef}
        className={classNames(
          'flex flex-1 border items-center justify-center outline-none p-0 duration-[160ms] disabled:opacity-75 hover:duration-300',
          buttonClass,
          className,
          disabled ? 'cursor-not-allowed' : 'cursor-pointer',
          isBorderless || isOutlined
            ? 'bg-transparent active:bg-transparent'
            : backgroundClass,
          {
            'border-transparent': isBorderless || !isOutlined,
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
            className="text-white duration-[160ms]"
            variant={typographyVariant}
            transform={transform}
            color={textColor}
          >
            {children}
          </Typography>
        )}
        {endIcon && endIcon}
      </button>
    </div>
  )
}
